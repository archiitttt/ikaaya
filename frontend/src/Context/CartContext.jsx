import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated, loadBuffer } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (!loadBuffer && isAuthenticated) {
      loadCart();
    }

    if (!loadBuffer && !isAuthenticated) {
      setCart([]);
    }
  }, [isAuthenticated, loadBuffer]);

  const loadCart = async () => {
    try {
      setCartLoading(true);
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setCartLoading(false);
    }
  };

  const ensureAuth = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!ensureAuth()) return;

    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });

    try {
      await api.post("/cart/add", { productId, quantity });
    } catch (err) {
      console.error("Add to cart failed, reloading cart");
      loadCart();
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!ensureAuth()) return;
    if (quantity < 1) return;

    setCart(prev =>
      prev.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );

    try {
      await api.put("/cart/update", { productId, quantity });
    } catch {
      loadCart();
    }
  };

  const removeFromCart = async (productId) => {
    if (!ensureAuth()) return;

    const prevCart = cart;
    setCart(prev => prev.filter(i => i.productId !== productId));

    try {
      await api.delete(`/cart/remove/${productId}`);
    } catch {
      setCart(prevCart);
    }
  };

  const clearCart = async () => {
    setCart([]);
    try {
      await api.delete("/cart/clear");
    } catch {
    }
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        totalItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        reloadCart: loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
