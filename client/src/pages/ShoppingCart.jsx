// shopping cart page  shows items added from the price comparison page
// each item shows the best store and price, with a quantity stepper
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../styles/ShoppingCart.css';

const COUPON_CODE = 'CARTY2'; // only valid coupon for now, gives £2 off
const COUPON_DISCOUNT = 2.00;

const STORE_LABELS = { tesco: 'Tesco', aldi: 'Aldi', lidl: 'Lidl', asda: 'Asda', sainsbury: 'Sainsbury', morrisons: 'Morrisons' };

export default function ShoppingCart() {
  const { items, removeItem, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const discount = couponApplied ? COUPON_DISCOUNT : 0;
  const total = Math.max(0, cartTotal - discount);

  const handleApplyCoupon = () => {
    if (couponInput.trim().toUpperCase() === COUPON_CODE) {
      setCouponApplied(true);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-page__inner container">

        {/* back arrow + title */}
        <div className="cart-header">
          <button className="cart-back-btn" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="cart-title">
            Shopping Cart{items.length > 0 && ` (${items.length})`}
          </h1>
        </div>

        {items.length === 0 ? (
          // empty state  nudge them to go add things
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link to="/price-comparison" className="btn-primary">Browse Price Comparison</Link>
          </div>
        ) : (
          <>
            {/* item list */}
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__store">Store: {STORE_LABELS[item.bestStore] || item.bestStore}</p>
                  </div>

                  <p className="cart-item__price">£{item.bestPrice.toFixed(2)}</p>

                  {/* quantity stepper  orange circles with − and + */}
                  <div className="cart-item__qty">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                    − Remove
                  </button>
                </div>
              ))}
            </div>

            {/* coupon input */}
            <div className="cart-coupon">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="cart-coupon__input"
              />
              <button className="cart-coupon__btn" onClick={handleApplyCoupon}>
                Apply
              </button>
            </div>

            {/* order summary card */}
            <div className="cart-summary">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>£{cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Coupon</span>
                <span>{couponApplied ? `−£${COUPON_DISCOUNT.toFixed(2)}` : '£0.00'}</span>
              </div>
              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
