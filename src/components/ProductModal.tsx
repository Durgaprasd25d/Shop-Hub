import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { setSelectedProduct } from "../store/slices/uiSlice"
import { addToCart } from "../store/slices/cartSlice"
import { X, ShoppingCart, Star } from "lucide-react"

const ProductModal = () => {
  const dispatch = useDispatch()
  const selectedProductId = useSelector((state: RootState) => state.ui.selectedProduct)
  const products = useSelector((state: RootState) => state.products.items)

  if (!selectedProductId) return null

  const product = products.find((p) => p.id === selectedProductId)
  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={() => dispatch(setSelectedProduct(null))}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start p-4 sm:p-6">
            <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-64 object-contain"
              />
            </div>

            <div className="sm:ml-4 sm:w-1/2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.title}</h3>

              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">(4.5/5)</span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>

              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ${product.price.toFixed(2)}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              <button
                onClick={() => {
                  dispatch(addToCart(product))
                  dispatch(setSelectedProduct(null))
                }}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal

