from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# =============== MODELS ===============

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    category: str
    images: List[str]
    stock: int
    supplier: str  # temu, shein, aliexpress
    tags: List[str] = []
    rating: float = 5.0
    reviews_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    category: str
    images: List[str]
    stock: int
    supplier: str
    tags: List[str] = []

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    image: str
    product_count: int = 0

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_email: str
    user_name: str
    items: List[dict]
    total: float
    status: str = "pending"  # pending, confirmed, shipped, delivered
    payment_method: str
    shipping_address: dict
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    user_email: str
    user_name: str
    items: List[dict]
    total: float
    payment_method: str
    shipping_address: dict

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    message: str
    response: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    message: str
    session_id: str

class AIGenerateRequest(BaseModel):
    product_name: str
    category: str
    keywords: Optional[List[str]] = []

class SocialPostRequest(BaseModel):
    product_name: str
    price: float
    description: str
    platform: str  # facebook, instagram, tiktok

# =============== AI FUNCTIONS ===============

async def generate_with_ai(prompt: str, session_id: str = "default") -> str:
    """Generate text using OpenAI GPT-5 via Emergent LLM Key"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message="You are a helpful AI assistant for LuxDrop.pt, a luxury e-commerce dropshipping platform."
        ).with_model("openai", "gpt-5")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        logger.error(f"AI generation error: {str(e)}")
        return f"Error generating content: {str(e)}"

# =============== ROUTES ===============

@api_router.get("/")
async def root():
    return {"message": "Welcome to LuxDrop.pt API"}

# ===== PRODUCTS =====

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    return product

@api_router.post("/products", response_model=Product)
async def create_product(input: ProductCreate):
    product_dict = input.model_dump()
    product_obj = Product(**product_dict)
    
    doc = product_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.products.insert_one(doc)
    return product_obj

@api_router.get("/products/featured/list", response_model=List[Product])
async def get_featured_products():
    products = await db.products.find({}, {"_id": 0}).sort("rating", -1).limit(8).to_list(8)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products

# ===== CATEGORIES =====

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(50)
    return categories

@api_router.post("/categories", response_model=Category)
async def create_category(category: Category):
    doc = category.model_dump()
    await db.categories.insert_one(doc)
    return category

# ===== ORDERS =====

@api_router.post("/orders", response_model=Order)
async def create_order(input: OrderCreate):
    order_dict = input.model_dump()
    order_obj = Order(**order_dict)
    
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.orders.insert_one(doc)
    
    # Send notification email (mocked)
    logger.info(f"Order notification sent to {order_obj.user_email}")
    
    return order_obj

@api_router.get("/orders", response_model=List[Order])
async def get_orders(user_email: Optional[str] = None):
    query = {}
    if user_email:
        query["user_email"] = user_email
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
        if isinstance(order.get('updated_at'), str):
            order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    if isinstance(order.get('updated_at'), str):
        order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    return order

@api_router.patch("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated", "status": status}

# ===== AI ENDPOINTS =====

@api_router.post("/ai/generate-description")
async def generate_description(request: AIGenerateRequest):
    """Generate product description using AI"""
    keywords_str = ", ".join(request.keywords) if request.keywords else ""
    prompt = f"""Generate a compelling, SEO-optimized product description for an e-commerce luxury dropshipping store.
    
    Product Name: {request.product_name}
    Category: {request.category}
    Keywords: {keywords_str}
    
    Create a description that:
    - Highlights luxury and quality
    - Is engaging and persuasive
    - Includes relevant keywords naturally
    - Is between 100-150 words
    - Focuses on benefits and features
    
    Return only the description text, no additional formatting."""
    
    description = await generate_with_ai(prompt, session_id="product_gen")
    
    # Generate SEO tags
    tags_prompt = f"Generate 5-7 relevant SEO tags for a product called '{request.product_name}' in category '{request.category}'. Return only comma-separated tags."
    tags_response = await generate_with_ai(tags_prompt, session_id="tags_gen")
    tags = [tag.strip() for tag in tags_response.split(",")]
    
    return {
        "description": description,
        "tags": tags
    }

@api_router.post("/ai/chatbot")
async def chatbot(request: ChatRequest):
    """AI Chatbot for customer support"""
    system_message = """You are a helpful customer support assistant for LuxDrop.pt, a luxury dropshipping e-commerce platform.
    
    Answer questions about:
    - Delivery times (typically 7-14 days for Portugal, 10-21 days for Europe)
    - Returns policy (30 days money-back guarantee)
    - Payment methods (Stripe, PayPal, MB Way, Credit Cards)
    - Product quality and authenticity
    - Order tracking
    - Shipping costs (Free shipping on orders over €50)
    
    Be friendly, professional, and concise. If you don't know something, politely suggest contacting support@luxdrop.pt"""
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=request.session_id,
            system_message=system_message
        ).with_model("openai", "gpt-5")
        
        user_message = UserMessage(text=request.message)
        response = await chat.send_message(user_message)
        
        # Save chat to database
        chat_doc = ChatMessage(
            session_id=request.session_id,
            message=request.message,
            response=response
        ).model_dump()
        chat_doc['created_at'] = chat_doc['created_at'].isoformat()
        await db.chat_messages.insert_one(chat_doc)
        
        return {"response": response}
    except Exception as e:
        logger.error(f"Chatbot error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")

@api_router.post("/ai/social-post")
async def generate_social_post(request: SocialPostRequest):
    """Generate social media post using AI"""
    platform_guides = {
        "facebook": "Create an engaging Facebook post with emojis, call-to-action, and friendly tone. Max 200 words.",
        "instagram": "Create an Instagram caption with relevant hashtags, emojis, and trendy language. Max 150 words.",
        "tiktok": "Create a TikTok video script/caption that's fun, trendy, and encourages engagement. Max 100 words."
    }
    
    guide = platform_guides.get(request.platform, platform_guides["facebook"])
    
    prompt = f"""Create a social media post for {request.platform} to promote this product:
    
    Product: {request.product_name}
    Price: €{request.price}
    Description: {request.description}
    
    Guidelines: {guide}
    
    Make it compelling, luxury-focused, and include a clear call-to-action to visit LuxDrop.pt
    
    Return only the post content."""
    
    post = await generate_with_ai(prompt, session_id="social_gen")
    return {"post": post, "platform": request.platform}

# ===== ADMIN & ANALYTICS =====

@api_router.get("/admin/stats")
async def get_admin_stats():
    """Get dashboard statistics"""
    total_products = await db.products.count_documents({})
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    
    # Calculate total revenue
    orders = await db.orders.find({}, {"_id": 0, "total": 1}).to_list(1000)
    total_revenue = sum(order.get("total", 0) for order in orders)
    
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_revenue": total_revenue
    }

# ===== SEED DATA =====

@api_router.post("/seed-data")
async def seed_data():
    """Seed database with example products and categories"""
    
    # Check if already seeded
    existing = await db.products.count_documents({})
    if existing > 0:
        return {"message": "Database already seeded"}
    
    # Create categories
    categories = [
        Category(id="cat1", name="Moda Feminina", slug="moda-feminina", image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400", product_count=12),
        Category(id="cat2", name="Moda Masculina", slug="moda-masculina", image="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400", product_count=8),
        Category(id="cat3", name="Acessórios", slug="acessorios", image="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400", product_count=15),
        Category(id="cat4", name="Beleza", slug="beleza", image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", product_count=10),
        Category(id="cat5", name="Electrónicos", slug="electronicos", image="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", product_count=6),
        Category(id="cat6", name="Casa & Decoração", slug="casa-decoracao", image="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400", product_count=9)
    ]
    
    for cat in categories:
        await db.categories.insert_one(cat.model_dump())
    
    # Create sample products
    products = [
        Product(
            id="prod1",
            name="Relógio Luxury Gold Edition",
            description="Relógio de pulso elegante com acabamento em ouro, perfeito para ocasiões especiais. Design sofisticado e atemporal.",
            price=89.99,
            original_price=149.99,
            category="Acessórios",
            images=["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"],
            stock=50,
            supplier="aliexpress",
            tags=["relógio", "luxo", "dourado", "elegante"],
            rating=4.8,
            reviews_count=127
        ),
        Product(
            id="prod2",
            name="Bolsa de Couro Premium",
            description="Bolsa de couro genuíno com design moderno e espaçoso. Ideal para o dia a dia com estilo.",
            price=119.99,
            original_price=199.99,
            category="Moda Feminina",
            images=["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600"],
            stock=30,
            supplier="shein",
            tags=["bolsa", "couro", "feminino", "elegante"],
            rating=4.9,
            reviews_count=203
        ),
        Product(
            id="prod3",
            name="Óculos de Sol Aviador",
            description="Óculos de sol estilo aviador com proteção UV400. Design clássico que nunca sai de moda.",
            price=39.99,
            original_price=79.99,
            category="Acessórios",
            images=["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"],
            stock=100,
            supplier="temu",
            tags=["óculos", "sol", "aviador", "proteção"],
            rating=4.6,
            reviews_count=89
        ),
        Product(
            id="prod4",
            name="Vestido Elegante de Noite",
            description="Vestido longo elegante ideal para eventos formais. Tecido premium com caimento perfeito.",
            price=149.99,
            original_price=249.99,
            category="Moda Feminina",
            images=["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600"],
            stock=25,
            supplier="shein",
            tags=["vestido", "elegante", "noite", "festa"],
            rating=4.9,
            reviews_count=156
        ),
        Product(
            id="prod5",
            name="Perfume Luxo Unissexo 100ml",
            description="Fragrância sofisticada e duradoura. Notas de especiarias e madeiras nobres.",
            price=69.99,
            original_price=129.99,
            category="Beleza",
            images=["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600", "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600"],
            stock=60,
            supplier="aliexpress",
            tags=["perfume", "fragrância", "luxo", "unissexo"],
            rating=4.7,
            reviews_count=234
        ),
        Product(
            id="prod6",
            name="Smartwatch Elite Pro",
            description="Smartwatch com monitorização de saúde, GPS e resistência à água. Perfeito para desportistas.",
            price=199.99,
            original_price=349.99,
            category="Electrónicos",
            images=["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600", "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600"],
            stock=40,
            supplier="temu",
            tags=["smartwatch", "tecnologia", "fitness", "saúde"],
            rating=4.8,
            reviews_count=412
        ),
        Product(
            id="prod7",
            name="Casaco de Pele Premium",
            description="Casaco luxuoso em pele sintética de alta qualidade. Quente e elegante para o inverno.",
            price=179.99,
            original_price=299.99,
            category="Moda Masculina",
            images=["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600"],
            stock=20,
            supplier="shein",
            tags=["casaco", "inverno", "pele", "masculino"],
            rating=4.7,
            reviews_count=98
        ),
        Product(
            id="prod8",
            name="Conjunto de Velas Aromáticas Luxo",
            description="Set de 3 velas aromáticas premium com fragrâncias relaxantes. Perfeito para criar ambiente.",
            price=45.99,
            original_price=89.99,
            category="Casa & Decoração",
            images=["https://images.unsplash.com/photo-1602874801006-94c29bcc5eb0?w=600", "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600"],
            stock=75,
            supplier="aliexpress",
            tags=["velas", "aromáticas", "decoração", "casa"],
            rating=4.9,
            reviews_count=267
        )
    ]
    
    for product in products:
        doc = product.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.products.insert_one(doc)
    
    return {"message": "Database seeded successfully", "products": len(products), "categories": len(categories)}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()