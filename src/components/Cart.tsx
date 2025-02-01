import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { removeFromCart, updateQuantity, toggleCart, clearCart } from "../store/slices/cartSlice"
import { X, Minus, Plus, ShoppingBag, LogIn, CreditCard, Loader } from "lucide-react"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../lib/firebase"

const Cart = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.cart)
  const { user } = useSelector((state: RootState) => state.auth)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("cart")
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 10 // Fixed shipping cost
  const finalTotal = total + shipping

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Error signing in:", error)
    }
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutStep("payment")
  }

  const handlePayment = async () => {
    setIsCheckingOut(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    dispatch(clearCart())
    setCheckoutStep("confirmation")
    setIsCheckingOut(false)
  }

  if (!user) {
    return (
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Shopping Cart</h2>
            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <LogIn className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">Please log in to continue shopping</p>
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Login with Google</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (checkoutStep === "confirmation") {
    return (
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order Confirmed</h2>
            <button
              onClick={() => {
                dispatch(toggleCart())
                setCheckoutStep("cart")
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Thank you for your order!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Your order has been confirmed. You will receive an email confirmation shortly.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (checkoutStep === "shipping") {
    return (
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Shipping Details</h2>
            <button
              onClick={() => setCheckoutStep("cart")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleShippingSubmit} className="flex-1 p-4 space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={shippingDetails.fullName}
                onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                className="w-full px-4 py-3 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input
                type="text"
                required
                value={shippingDetails.address}
                onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                className="w-full px-4 py-3 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input
                type="text"
                required
                value={shippingDetails.city}
                onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                className="w-full px-4 py-3 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
              <input
                type="text"
                required
                value={shippingDetails.postalCode}
                onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                className="w-full px-4 py-3 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
              <input
                type="text"
                required
                value={shippingDetails.country}
                onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
                className="w-full px-4 py-3 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (checkoutStep === "payment") {
    return (
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Payment</h2>
            <button
              onClick={() => setCheckoutStep("shipping")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-4 sm:space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-800 dark:text-white">Total</span>
                  <span className="text-primary-600 dark:text-primary-400">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base sm:text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isCheckingOut}
                className="w-full py-4 sm:py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2 text-lg sm:text-base"
              >
                {isCheckingOut ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Pay ${finalTotal.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Shopping Cart</h2>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 sm:space-x-4 mb-4 p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  />

                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2">{item.title}</h3>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: Math.max(0, item.quantity - 1) }))
                          }
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-800 dark:text-white">Subtotal</span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setCheckoutStep("shipping")}
                className="w-full py-4 sm:py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-lg sm:text-base"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart

