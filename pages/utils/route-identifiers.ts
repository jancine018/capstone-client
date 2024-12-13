// src/utils/route-identifiers.ts
export const Routes = {
    PRODUCT_DETAILS: "ProductDetails",
    CART_PAGE: "CartPage",
    PLACE_ORDER: "PlaceOrder",
  } as const;
  
  export interface ProductDetailsParams {
    productId: number;
  }
  