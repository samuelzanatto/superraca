import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Product } from '@/data/products'

export interface CartItem {
    product: Product
    size?: string // P, M, G, GG, etc.
    quantity: number
}

interface CartState {
    items: CartItem[]
    
    // Actions
    addItem: (product: Product, size?: string) => void
    removeItem: (productId: string, size?: string) => void
    updateItemQuantity: (productId: string, size: string | undefined, quantity: number) => void
    clearCart: () => void
    
    // Computed Values (Getters)
    getTotalPrice: () => number
    getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, size) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (i) => i.product.id === product.id && i.size === size
                    )

                    if (existingItemIndex > -1) {
                        // Increment quantity if item with same size already in cart
                        const newItems = [...state.items]
                        newItems[existingItemIndex].quantity += 1
                        return { items: newItems }
                    }

                    // Add new item
                    return {
                        items: [...state.items, { product, size, quantity: 1 }]
                    }
                })
            },

            removeItem: (productId, size) => {
                set((state) => ({
                    items: state.items.filter(
                        (i) => !(i.product.id === productId && i.size === size)
                    )
                }))
            },

            updateItemQuantity: (productId, size, quantity) => {
                set((state) => ({
                    items: state.items.map((i) => {
                        if (i.product.id === productId && i.size === size) {
                            return { ...i, quantity: Math.max(1, quantity) }
                        }
                        return i
                    })
                }))
            },

            clearCart: () => set({ items: [] }),

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            }
        }),
        {
            name: 'super-raca-cart-storage' // Persist data in localStorage
        }
    )
)
