/**
 * Backend stores productId as colorOptionId when no color variant is chosen.
 * Real color options are distinct ObjectIds on product.colorOption.
 */
export const isRealColorOption = (productId, colorOptionId) =>
  Boolean(colorOptionId) && String(colorOptionId) !== String(productId);

/** Color id the cart APIs expect (update/remove) for a line item. */
export const resolveStoredColorId = (productId, colorOptionId = null) => {
  if (isRealColorOption(productId, colorOptionId)) {
    return colorOptionId;
  }
  return productId;
};

/** Stable key for a product + optional color variant + optional size. */
export const getProductCartKey = (
  productId,
  colorOptionId = null,
  size = null
) => {
  const colorKey = isRealColorOption(productId, colorOptionId)
    ? String(colorOptionId)
    : "default";
  const sizeKey = size ? String(size) : "default";
  return `${productId}-${colorKey}-${sizeKey}`;
};

/** Stable unique key for a cart line. */
export const getCartItemKey = (item, index = 0) => {
  const productId = item?.product?._id || item?.productId;
  if (productId) {
    return getProductCartKey(productId, item?.colorOptionId, item?.size);
  }
  return item?._id || `item-${index}`;
};

/** Find a cart line for a product (and optional color / size). */
export const findCartItem = (
  cartItems,
  productId,
  colorOptionId = null,
  size = null
) => {
  if (!Array.isArray(cartItems) || !productId) return null;
  const targetKey = getProductCartKey(productId, colorOptionId, size);

  return (
    cartItems.find((item) => {
      const id = item?.product?._id || item?.productId;
      if (!id || String(id) !== String(productId)) return false;
      return (
        getProductCartKey(id, item?.colorOptionId, item?.size) === targetKey
      );
    }) || null
  );
};

/**
 * Collapse duplicate lines of the same product (+ color + size) into one row
 * with summed quantity.
 */
export const mergeCartItems = (cartItems = []) => {
  const map = new Map();

  cartItems.forEach((item) => {
    if (!item?.product) return;

    const productId = item.product._id || item.productId;
    if (!productId) return;

    const key = getProductCartKey(productId, item.colorOptionId, item.size);
    const qty = Number(item.quantity) || 0;

    if (map.has(key)) {
      const existing = map.get(key);
      existing.quantity = (Number(existing.quantity) || 0) + qty;
    } else {
      map.set(key, {
        ...item,
        productId,
        // Keep the stored color id the APIs need (often productId itself).
        colorOptionId: resolveStoredColorId(productId, item.colorOptionId),
        size: item.size || null,
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

/** Normalize wishlist API products into a consistent shape for the UI. */
export const normalizeWishlistProducts = (payload) => {
  const raw =
    payload?.products ||
    payload?.wishlist?.products ||
    (Array.isArray(payload) ? payload : []);

  return (Array.isArray(raw) ? raw : [])
    .map((item) => {
      if (!item) return null;
      const product =
        item.product && typeof item.product === "object" ? item.product : item;
      if (!product || typeof product !== "object") return null;

      const id = product._id || item._id || item.productId;
      if (!id) return null;

      return {
        ...product,
        _id: id,
        product_name:
          product.product_name ||
          product.productName ||
          product.name ||
          "Product",
        productImage:
          product.productImage ||
          product.product_image ||
          product.image ||
          "",
        selling_price:
          product.selling_price ?? product.sellingPrice ?? null,
        mrp_price: product.mrp_price ?? product.mrpPrice ?? null,
        stock_quantity:
          product.stock_quantity ??
          product.remaining_quantity ??
          product.stock ??
          0,
      };
    })
    .filter(Boolean);
};
