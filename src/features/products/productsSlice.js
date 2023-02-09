import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteProduct, fetchProducts, postProduct } from "./productsAPI";

const initialState = {
  products: [],
  isLoading: false,
  isError: false,
  error: "",
  postSuccess: false,
  deleteSuccess: false,
};
export const getProducts = createAsyncThunk("products/getProduct", async () => {
  const products = fetchProducts();
  return products;
});
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (data) => {
    const products = postProduct(data);
    return products;
  }
);
export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id, thunkAPI) => {
    const products = await deleteProduct(id);
    thunkAPI.dispatch(removeFromList(id));
    return products;
  }
);
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    togglePostSuccess: (state) => {
      state.postSuccess = false;
    },
    reducers: {
      toggleDeleteSuccess: (state) => {
        state.deleteSuccess = false;
      },
      removeFromList: (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload._id
        );
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getProducts.pending, (state, action) => {
          state.isLoading = true;
          state.error = false;
        })
        .addCase(getProducts.fulfilled, (state, action) => {
          state.products = action.payload;
          state.isLoading = false;
          state.error = false;
        })
        .addCase(getProducts.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.products = [];
          state.error = action.error.message;
        })
        .addCase(addProduct.pending, (state, action) => {
          state.isLoading = true;
          state.error = false;
          state.postSuccess = false;
        })
        .addCase(addProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = false;
          state.postSuccess = true;
        })
        .addCase(addProduct.rejected, (state, action) => {
          state.postSuccess = false;
          state.isError = true;
          state.products = [];

          state.error = action.error.message;
        })
        .addCase(removeProduct.pending, (state, action) => {
          state.isLoading = true;
          state.error = false;
          state.deleteSuccess = false;
        })
        .addCase(removeProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = false;
          state.deleteSuccess = true;
        })
        .addCase(removeProduct.rejected, (state, action) => {
          state.deleteSuccess = false;
          state.isError = true;
          state.products = [];

          state.error = action.error.message;
        });
    },
  },
});
export const { togglePostSuccess, toggleDeleteSuccess, removeFromList } =
  productsSlice.actions;

export default productsSlice.reducer;
