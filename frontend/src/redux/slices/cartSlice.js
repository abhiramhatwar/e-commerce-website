import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    totalProducts: 0,
  },
  reducers: {
    initializeCart: (state, action) => {
      const { products } = action.payload;
      state.products = products;
      state.totalProducts = products.length;
    },
    addProduct: (state, action) => {
      const { product, quantity } = action.payload;
      const productIndex = state.products.findIndex((prod) => prod.product._id == product._id);

      if (productIndex >= 0) {
        state.products[productIndex].quantity += 1;
      } else {
        state.products.push({ product, quantity });
        state.totalProducts += 1;
      }
    },
    removeProduct: (state, action) => {
      const { product } = action.payload;
      const productIndex = state.products.findIndex((prod) => prod.product._id == product._id);

      state.products.splice(productIndex, 1);
      state.totalProducts -= 1;
    },
    updateQuantity: (state, action) => {
      const { product, quantity } = action.payload;

      const productIndex = state.products.findIndex((prod) => prod.product._id == product._id);

      state.products[productIndex].quantity = quantity;
    },
    clearCart: () => {
      return {
        products: [],
        totalProducts: 0,
      };
    },
  },
});

export const { initializeCart, addProduct, removeProduct, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
