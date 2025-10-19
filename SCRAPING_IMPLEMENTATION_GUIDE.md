# Guia de Implementação de Web Scraping Real

Este documento fornece instruções sobre como implementar web scraping real dos fornecedores (Temu, Shein, AliExpress) no futuro.

## Visão Geral

Atualmente, a LuxDrop.pt utiliza produtos mockados (exemplo) armazenados no MongoDB. Para implementar sincronização real com fornecedores, você precisará:

## Opção 1: APIs Oficiais (Recomendado)

### Temu API
- **Website**: https://seller.temu.com/developer/
- **O que fazer**: Registar-se como parceiro/vendedor e solicitar acesso à API
- **Benefícios**: Legal, estável, suporte oficial
- **Dados disponíveis**: Produtos, preços, stock, imagens

### AliExpress API (Affiliate Program)
- **Website**: https://portals.aliexpress.com/
- **O que fazer**: Juntar-se ao programa de afiliados
- **Benefícios**: Comissões + acesso à API
- **Dados disponíveis**: Produtos, preços, links de afiliado

### Shein API
- **Website**: https://www.shein.com/affiliate
- **O que fazer**: Aplicar ao programa de parceiros
- **Benefícios**: API oficial para dropshipping
- **Dados disponíveis**: Catálogo completo, preços dinâmicos

## Opção 2: Web Scraping (Alternativa)

⚠️ **AVISO**: Web scraping pode violar os Termos de Serviço. Use apenas se tiver permissão explícita.

### Ferramentas Recomendadas

1. **Scrapy** (Python)
```bash
pip install scrapy scrapy-playwright
```

2. **BeautifulSoup + Selenium**
```bash
pip install beautifulsoup4 selenium webdriver-manager
```

3. **Playwright** (para sites JavaScript-heavy)
```bash
pip install playwright
playwright install
```

### Exemplo de Estrutura

```python
# /app/backend/scrapers/base_scraper.py
from abc import ABC, abstractmethod

class BaseScraper(ABC):
    @abstractmethod
    async def scrape_products(self, category: str):
        pass
    
    @abstractmethod
    async def scrape_product_details(self, product_id: str):
        pass
    
    @abstractmethod
    async def check_stock(self, product_id: str):
        pass

# /app/backend/scrapers/temu_scraper.py
class TemuScraper(BaseScraper):
    async def scrape_products(self, category: str):
        # Implementar lógica de scraping
        pass

# /app/backend/scrapers/aliexpress_scraper.py
class AliExpressScraper(BaseScraper):
    # Similar ao Temu
    pass
```

### Endpoints a Criar

```python
# /app/backend/server.py

@api_router.post("/sync/products")
async def sync_products_from_suppliers():
    """Sincronizar produtos de todos os fornecedores"""
    temu_scraper = TemuScraper()
    shein_scraper = SheinScraper()
    aliexpress_scraper = AliExpressScraper()
    
    # Executar scraping
    products = []
    products.extend(await temu_scraper.scrape_products("all"))
    products.extend(await shein_scraper.scrape_products("all"))
    products.extend(await aliexpress_scraper.scrape_products("all"))
    
    # Salvar no MongoDB
    for product in products:
        await db.products.update_one(
            {"supplier_id": product["supplier_id"]},
            {"$set": product},
            upsert=True
        )
    
    return {"message": f"Synced {len(products)} products"}

@api_router.post("/sync/prices")
async def sync_prices():
    """Atualizar preços de todos os produtos"""
    products = await db.products.find({}).to_list(1000)
    
    for product in products:
        if product["supplier"] == "temu":
            scraper = TemuScraper()
        elif product["supplier"] == "shein":
            scraper = SheinScraper()
        else:
            scraper = AliExpressScraper()
        
        details = await scraper.scrape_product_details(product["supplier_id"])
        
        # Atualizar preço
        await db.products.update_one(
            {"id": product["id"]},
            {"$set": {
                "price": details["price"],
                "stock": details["stock"]
            }}
        )
    
    return {"message": "Prices updated"}
```

## Implementação de Agendamento

Use **APScheduler** para sincronização automática:

```bash
pip install apscheduler
```

```python
# /app/backend/scheduler.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

@scheduler.scheduled_job('interval', hours=6)
async def sync_products_job():
    await sync_products_from_suppliers()

@scheduler.scheduled_job('interval', hours=1)
async def sync_prices_job():
    await sync_prices()

scheduler.start()
```

## Considerações Importantes

### 1. Rate Limiting
- Respeite limites de requisições
- Use delays entre requests
- Implemente retry logic

```python
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def scrape_with_retry(url):
    await asyncio.sleep(2)  # Rate limiting
    # Scraping logic
```

### 2. User Agents
- Rotacionar User-Agents
- Usar proxies se necessário

```python
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
]
```

### 3. Tratamento de Erros
- Logar erros detalhadamente
- Notificar admin em caso de falha
- Manter backup dos dados

### 4. Validação de Dados
- Verificar se preços são válidos
- Validar URLs de imagens
- Garantir que stock > 0

## Alternativas Profissionais

### 1. Oberlo / Spocket
- Plataformas de dropshipping prontas
- APIs integradas
- Sincronização automática
- Custo: $29-79/mês

### 2. Importify
- Importação automática de produtos
- Suporte para múltiplos fornecedores
- Custo: $14-75/mês

### 3. Dropified
- Automação completa
- Gestão de pedidos
- Custo: $47-127/mês

## Próximos Passos

1. **Decidir abordagem**: API oficial vs scraping
2. **Registar contas** nos fornecedores
3. **Solicitar acesso** a APIs
4. **Implementar scrapers** (se necessário)
5. **Testar** sincronização
6. **Agendar** jobs automáticos
7. **Monitorizar** performance e erros

## Recursos Úteis

- [Scrapy Documentation](https://docs.scrapy.org/)
- [Playwright Python](https://playwright.dev/python/)
- [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/)
- [AliExpress API Guide](https://developers.aliexpress.com/)

## Suporte

Para questões sobre implementação, contacte:
- Email: support@luxdrop.pt
- Documentação adicional na pasta `/app/docs/`
