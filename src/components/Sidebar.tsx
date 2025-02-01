import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchCategories, setCategory } from '../store/slices/productsSlice';
import { AppDispatch } from '../store/store';
import { Tags, X, Menu } from 'lucide-react';

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, currentCategory } = useSelector((state: RootState) => state.products);
  const { isSidebarOpen } = useSelector((state: RootState) => state.ui);  // Sidebar open/close state
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Tags className="h-6 w-6 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Categories</h2>
          </div>
          {/* Menu button for toggling sidebar */}
          <button
            onClick={() => dispatch({ type: 'ui/toggleSidebar' })} // Toggle sidebar visibility
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => dispatch(setCategory(null))}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              currentCategory === null
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => dispatch(setCategory(category))}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                currentCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
