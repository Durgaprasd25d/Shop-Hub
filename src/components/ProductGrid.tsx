import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { fetchProducts, setCurrentPage } from "../store/slices/productsSlice"
import { addToCart } from "../store/slices/cartSlice"
import { setSelectedProduct } from "../store/slices/uiSlice"
import { ShoppingCart, Eye } from "lucide-react"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../lib/firebase"

const ProductGrid = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, status, error, currentCategory, searchQuery, currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.products,
  )
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user && status === "idle") {
      dispatch(fetchProducts())
    }
  }, [status, user, dispatch])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col px-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Please log in to view products
        </h2>
        <button
          onClick={async () => {
            try {
              await signInWithPopup(auth, googleProvider)
            } catch (error) {
              console.error("Error signing in:", error)
            }
          }}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Log in with Google
        </button>
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (status === "failed") {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>
  }

  const filteredProducts = items.filter(
    (product) =>
      (!currentCategory || product.category === currentCategory) &&
      (!searchQuery || product.title.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative pb-[100%]">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">{product.title}</h3>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {product.category}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>

                <button
                  onClick={() => dispatch(setSelectedProduct(product.id))}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => dispatch(setCurrentPage(page))}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg mb-2 ${
                currentPage === page
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGrid

