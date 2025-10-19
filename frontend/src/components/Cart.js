import { Link } from "react-router-dom";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

const Cart = ({ cart, isOpen, onClose, removeFromCart, updateQuantity }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
        data-testid="cart-overlay"
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-[#0a0a0a] border-l border-white/10 z-50 shadow-2xl" data-testid="cart-sidebar">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold gold-text" data-testid="cart-title">Carrinho</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              data-testid="cart-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4" data-testid="cart-items-container">
            {cart.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-cart">
                <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">O seu carrinho está vazio</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="glass rounded-lg p-4" data-testid={`cart-item-${item.id}`}>
                  <div className="flex space-x-4">
                    <img 
                      src={item.images[0]} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      data-testid={`cart-item-image-${item.id}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm mb-1" data-testid={`cart-item-name-${item.id}`}>
                        {item.name}
                      </h3>
                      <p className="text-[#D4AF37] font-bold text-sm" data-testid={`cart-item-price-${item.id}`}>
                        €{item.price.toFixed(2)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          data-testid={`cart-item-decrease-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-medium" data-testid={`cart-item-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          data-testid={`cart-item-increase-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-400 hover:text-red-300 text-xs transition-colors"
                          data-testid={`cart-item-remove-${item.id}`}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total:</span>
                <span className="text-2xl font-bold gold-text" data-testid="cart-total">
                  €{total.toFixed(2)}
                </span>
              </div>
              <Link 
                to="/checkout" 
                onClick={onClose}
                className="block w-full btn-gold text-center py-3 rounded-lg"
                data-testid="checkout-btn"
              >
                Finalizar Compra
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;