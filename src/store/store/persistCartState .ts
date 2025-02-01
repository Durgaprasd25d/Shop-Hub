export const persistCartState = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Ensure the returned state has both `items` and `isOpen`
      return { items: parsedCart.items || [], isOpen: parsedCart.isOpen || false };
    }
    return { items: [], isOpen: false }; // Default state if no data in localStorage
  };
  