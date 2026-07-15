import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.bookId === book._id);
      if (existing) {
        return prev.map((item) =>
          item.bookId === book._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, book.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          bookId: book._id,
          title: book.title,
          price: book.price,
          image: book.image,
          stock: book.stock,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) return removeFromCart(bookId);
    setCart((prev) =>
      prev.map((item) =>
        item.bookId === bookId ? { ...item, quantity: Math.min(quantity, item.stock) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
