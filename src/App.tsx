import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { setUser, clearUser } from './store/slices/authSlice';
import { RootState } from './store/store';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';
import { ShoppingCart } from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const cartOpen = useSelector((state: RootState) => state.cart.isOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        }));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<ProductGrid />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          {cartOpen && <Cart />}
        </div>
        <ProductModal />
      </div>
    </Router>
  );
}

export default App;