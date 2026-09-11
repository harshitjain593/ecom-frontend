import React from 'react';
import { Link } from 'react-router-dom';
import { CiSquareMinus, CiSquarePlus } from 'react-icons/ci';
import css from './ordersummary.module.css';
import { formatNumberWithCommas } from '../../assest/js/checker';
import {
  getLineDiscountPercent,
  getLineMrp,
  getLineSellingPrice,
} from '../../utils/orderCheckoutUtils';

const OrderSummaryItem = ({
  item,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  updating,
}) => {
  const product = item?.product;
  if (!product) return null;

  const mrp = getLineMrp(item);
  const selling = getLineSellingPrice(item);
  const discountPct = getLineDiscountPercent(item);
  const lineQty = quantity?.[item.colorOptionId] ?? item.quantity ?? 1;

  return (
    <main key={item.colorOptionId || product._id}>
      <div>
        <img
          src={product.productImage}
          alt={product.product_name || 'Product'}
        />
      </div>
      <section>
        <div className={css.toptext}>
          <main>
            <div className={css.productnames}>
              <p>{product.product_name}</p>
              {product.category && <p>{product.category}</p>}
              {item.size && <p>Size: {item.size}</p>}
            </div>
          </main>
        </div>
        <div className={css.priceoffer}>
          <p>₹{formatNumberWithCommas(mrp)}</p>
          <p>₹{formatNumberWithCommas(selling)}</p>
          {discountPct > 0 && <p>{discountPct}% OFF</p>}
        </div>
        <div className={css.summarybutns}>
          <div className={css.quantityBox}>
            <CiSquareMinus
              size={34}
              onClick={() =>
                !updating &&
                onDecrease(product._id, item.colorOptionId, lineQty)
              }
            />
            <p
              className={css.statQuantity}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {lineQty}
            </p>
            <CiSquarePlus
              size={34}
              onClick={() =>
                !updating &&
                onIncrease(product._id, item.colorOptionId, lineQty)
              }
            />
            <button
              type="button"
              disabled={updating}
              onClick={() => onRemove(product._id, item.colorOptionId)}
            >
              Remove
            </button>
          </div>
          <Link to="/">Back to shopping</Link>
        </div>
      </section>
    </main>
  );
};

export default OrderSummaryItem;
