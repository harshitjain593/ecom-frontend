import React from 'react';
import css from './ordersummary.module.css';
import { formatNumberWithCommas } from '../../assest/js/checker';
import { getSummaryTotals } from '../../utils/orderCheckoutUtils';

const OrderSummaryPricePanel = ({ summary }) => {
  if (!summary) return null;

  const {
    totalQuantity,
    totalPrice,
    totalPayablePrice,
    totalDiscountedPrice,
  } = getSummaryTotals(summary);

  return (
    <section className={css.priceDetails}>
      <div>
        <h4>price details</h4>
      </div>
      <main>
        <div className={css.priceTop}>
          <p>
            <span>price (item:{totalQuantity})</span>
            <span>₹{formatNumberWithCommas(totalPrice)}</span>
          </p>
          <p>
            <span>delivery charges</span>
            <span className="text-success">free</span>
          </p>
        </div>
        {totalDiscountedPrice > 0 && (
          <div className="d-flex justify-content-between">
            <p style={{ textTransform: 'capitalize', fontWeight: 500 }}>
              discounted price
            </p>
            <p className="text-success" style={{ fontWeight: 400 }}>
              ₹{formatNumberWithCommas(totalDiscountedPrice)}
            </p>
          </div>
        )}
        <div className={css.total}>
          <p>total payable</p>
          <p>₹{formatNumberWithCommas(totalPayablePrice)}</p>
        </div>
        {totalDiscountedPrice > 0 && (
          <div className={css.savings}>
            <p className="text-success">
              your total savings on this order is ₹
              {formatNumberWithCommas(totalDiscountedPrice)}
            </p>
          </div>
        )}
      </main>
    </section>
  );
};

export default OrderSummaryPricePanel;
