export const SELECTED_ADDRESS_ID_KEY = 'selectedShippingAddressId';
export const PENDING_ADDRESS_ID_KEY = 'pendingAddressId';

export const persistSelectedAddress = (address) => {
  if (address?._id) {
    sessionStorage.setItem(SELECTED_ADDRESS_ID_KEY, address._id);
  }
};

export const clearSelectedAddress = () => {
  sessionStorage.removeItem(SELECTED_ADDRESS_ID_KEY);
};

export const resolveSelectedAddress = (addresses = []) => {
  if (!Array.isArray(addresses) || addresses.length === 0) return null;

  const savedId =
    sessionStorage.getItem(SELECTED_ADDRESS_ID_KEY) ||
    sessionStorage.getItem(PENDING_ADDRESS_ID_KEY);

  if (savedId) {
    const match = addresses.find((addr) => addr._id === savedId);
    if (match) {
      sessionStorage.removeItem(PENDING_ADDRESS_ID_KEY);
      return match;
    }
  }

  return addresses[0];
};

export const formatAddressLine = (address) => {
  if (!address) return '';
  const parts = [
    address.billing_address,
    address.district,
    address.state,
    address.pinCode ? `PIN: ${address.pinCode}` : '',
  ].filter(Boolean);
  return parts.join(', ');
};

/** Order-summary line item fields from mobileApi/summary/order-summary */
export const getLineMrp = (item) =>
  item?.mrp_price ?? item?.product?.mrp_price ?? 0;

export const getLineSellingPrice = (item) =>
  item?.selling_price ?? item?.product?.selling_price ?? 0;

export const getLineDiscount = (item) => {
  if (item?.discounting_price != null) return item.discounting_price;
  const mrp = getLineMrp(item);
  const selling = getLineSellingPrice(item);
  return Math.max(0, mrp - selling);
};

export const getLineDiscountPercent = (item) => {
  const mrp = getLineMrp(item);
  if (!mrp) return 0;
  const selling = getLineSellingPrice(item);
  return Math.round(((mrp - selling) / mrp) * 100);
};

export const hasOrderItems = (summary) =>
  Array.isArray(summary?.orderItems) && summary.orderItems.length > 0;

export const getSummaryTotals = (summary) => ({
  totalQuantity: summary?.totalQuantity ?? 0,
  totalPrice: summary?.totalPrice ?? 0,
  totalPayablePrice: summary?.totalPayablePrice ?? 0,
  totalDiscountedPrice: summary?.totalDiscountedPrice ?? 0,
});
