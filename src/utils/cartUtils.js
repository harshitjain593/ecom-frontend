/** Stable key for a product + optional color variant. */
export const getProductCartKey = (productId, colorOptionId = null) =>
  `${productId}-${colorOptionId || "default"}`;

/** Stable unique key for a cart line (prefers product+color after merge). */
export const getCartItemKey = (item, index = 0) => {
  const productId = item?.product?._id || item?.productId;
  if (productId) {
    return getProductCartKey(productId, item?.colorOptionId);
  }
  return item?._id || `item-${index}`;
};

/** Find a cart line for a product (and optional color). */
export const findCartItem = (cartItems, productId, colorOptionId = null) => {
  if (!Array.isArray(cartItems) || !productId) return null;
  const targetColor = colorOptionId || null;

  return (
    cartItems.find((item) => {
      const id = item?.product?._id || item?.productId;
      if (id !== productId) return false;
      const itemColor = item?.colorOptionId || null;
      return itemColor === targetColor;
    }) || null
  );
};

/**
 * Collapse duplicate lines of the same product (+ color) into one row
 * with summed quantity.
 */
export const mergeCartItems = (cartItems = []) => {
  const map = new Map();

  cartItems.forEach((item) => {
    if (!item?.product) return;

    const productId = item.product._id || item.productId;
    if (!productId) return;

    const key = getProductCartKey(productId, item.colorOptionId);
    const qty = Number(item.quantity) || 0;

    if (map.has(key)) {
      const existing = map.get(key);
      existing.quantity = (Number(existing.quantity) || 0) + qty;
    } else {
      map.set(key, {
        ...item,
        productId,
        quantity: qty,
      });
    }
  });

  return Array.from(map.values());
};

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
  const rawItems = (cart.cartItems ?? cart.items ?? []).filter(
    (item) => item && item.product
  );
  const cartItems = mergeCartItems(rawItems);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  return {
    ...cart,
    cartItems,
    totalQuantity,
    totalPrice: cart.totalPrice ?? 0,
    totalPayablePrice: cart.totalPayablePrice ?? 0,
    totalDiscountedPrice: cart.totalDiscountedPrice ?? 0,
  };
};
