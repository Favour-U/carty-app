// cart context manages the shopping basket tied to price comparison
// items persist in localStorage so the cart survives a page refresh
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // load from localStorage on first render so the cart isn't wiped on refresh
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('carty_cart') || '[]');
    } catch { return []; }
  });

  // keep localStorage in sync whenever the cart changes
  useEffect(() => {
    localStorage.setItem('carty_cart', JSON.stringify(items));
  }, [items]);

  // add a product to the basket  increments qty if already in there
  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // completely removes an item from the basket
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  // update quantity  removes the item if qty drops to 0
  const updateQty = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  // wipe the whole cart
  const clearCart = () => setItems([]);

  // total at best prices (Carty optimised)
  const cartTotal = items.reduce((sum, i) => sum + i.bestPrice * i.quantity, 0);

  // total at regular (most expensive) prices  used to calculate savings
  const regularTotal = items.reduce((sum, i) => sum + i.regularPrice * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, cartTotal, regularTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// custom hook so components just do: const { items, addItem } = useCart()
export function useCart() {
  return useContext(CartContext);
}
