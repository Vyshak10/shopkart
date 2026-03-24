import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.getCart();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId, quantity) => {
    await cartAPI.add({ productId, quantity });
    await fetchCart();
  };

  const updateQuantity = async (itemId, quantity) => {
    await cartAPI.update(itemId, { quantity });
    await fetchCart();
  };

  const removeFromCart = async (itemId) => {
    await cartAPI.remove(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, total, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
