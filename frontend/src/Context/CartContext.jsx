import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import cartService from "../Services/cartService";
import { useNavigate } from "react-router-dom";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated, loadBuffer } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    if (!loadBuffer && isAuthenticated) {
      loadCart();
    }

    if (!loadBuffer && !isAuthenticated) {
      setCart([]);
      setCartError(null);
    }
  }, [isAuthenticated, loadBuffer]);

  const loadCart = async () => {
    try {
      setCartLoading(true);
      setCartError(null);
      const cartData = await cartService.getCart();
      setCart(cartData.items || []);
    } catch (err) {
      console.error("Failed to load cart", err);
      setCartError("Failed to load cart");
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

    try {
      setCartError(null);
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCart(updatedCart.items || []);
      return updatedCart;
    } catch (err) {
      console.error("Add to cart failed:", err);
      setCartError(err.response?.data?.message || "Failed to add item to cart");
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!ensureAuth()) return;
    if (quantity < 1) return;

    try {
      setCartError(null);
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      setCart(updatedCart.items || []);
      return updatedCart;
    } catch (err) {
      console.error("Update quantity failed:", err);
      setCartError(err.response?.data?.message || "Failed to update quantity");
      await loadCart(); // Reload cart on error
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    if (!ensureAuth()) return;

    try {
      setCartError(null);
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart.items || []);
      return updatedCart;
    } catch (err) {
      console.error("Remove from cart failed:", err);
      setCartError(err.response?.data?.message || "Failed to remove item");
      await loadCart(); // Reload cart on error
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setCartError(null);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart.items || []);
      return updatedCart;
    } catch (err) {
      console.error("Clear cart failed:", err);
      setCartError(err.response?.data?.message || "Failed to clear cart");
      throw err;
    }
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        cartError,
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
