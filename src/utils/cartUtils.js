/** Normalize cart API payloads (result vs result.cart). */
export const normalizeCartPayload = (result) => {
  if (!result) {
    return {
      cartItems: [],
      totalQuantity: 0,
      totalPrice: 0,
      totalPayablePrice: 0,
      totalDiscountedPrice: 0,
    };
  }

  const cart = result.cart ?? result;

  return {
    ...cart,
    cartItems: cart.cartItems ?? cart.items ?? [],
    totalQuantity: cart.totalQuantity ?? 0,
    totalPrice: cart.totalPrice ?? 0,
    totalPayablePrice: cart.totalPayablePrice ?? 0,
    totalDiscountedPrice: cart.totalDiscountedPrice ?? 0,
  };
};
