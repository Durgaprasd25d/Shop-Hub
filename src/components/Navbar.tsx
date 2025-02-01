import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { setSearchQuery } from "../store/slices/productsSlice";
import { toggleCart } from "../store/slices/cartSlice";
import { toggleDarkMode, toggleSidebar } from "../store/slices/uiSlice";
import { RootState } from "../store/store";
import { Search, ShoppingCart, Sun, Moon, LogIn, LogOut, Menu } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const { darkMode } = useSelector((state: RootState) => state.ui);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleSidebar())} // Toggle sidebar visibility
              className="mr-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">ShopHub</h1>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4 hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img
                  src={user.photoURL || "https://via.placeholder.com/32"}
                  alt={user.displayName || "User"}
                  className="h-8 w-8 rounded-full"
                />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="sm:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
