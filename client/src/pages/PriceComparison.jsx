// price comparison page  shows prices across 6 supermarkets
// best price per item is highlighted but you can add from any store you choose
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../styles/PriceComparison.css';

const STORES = ['tesco', 'aldi', 'lidl', 'asda', 'sainsbury', 'morrisons'];
const STORE_LABELS = { tesco: 'Tesco', aldi: 'Aldi', lidl: 'Lidl', asda: 'Asda', sainsbury: 'Sainsbury', morrisons: 'Morrisons' };

// product catalogue with prices at each store
const ALL_PRODUCTS = [
  { id: 1,  name: 'Whole Milk (4 pints)',           tesco: 1.55, aldi: 1.35, lidl: 1.59, asda: 1.46, sainsbury: 1.50, morrisons: 1.50 },
  { id: 2,  name: 'Wheat Bread',                     tesco: 1.25, aldi: 1.09, lidl: 0.99, asda: 1.34, sainsbury: 1.04, morrisons: 1.25 },
  { id: 3,  name: 'Eggs (12 Large)',                 tesco: 1.99, aldi: 2.40, lidl: 2.05, asda: 2.30, sainsbury: 2.40, morrisons: 2.05 },
  { id: 4,  name: 'Minced Beef (500g)',              tesco: 3.00, aldi: 3.05, lidl: 3.10, asda: 2.99, sainsbury: 3.50, morrisons: 3.60 },
  { id: 5,  name: 'Porridge Oats (1Kg)',             tesco: 1.40, aldi: 1.35, lidl: 1.50, asda: 1.50, sainsbury: 1.40, morrisons: 1.25 },
  { id: 6,  name: 'Chicken (12 Drumsticks)',         tesco: 1.50, aldi: 1.45, lidl: 1.25, asda: 1.50, sainsbury: 1.00, morrisons: 1.25 },
  { id: 7,  name: 'Garlic Cloves',                   tesco: 1.55, aldi: 1.35, lidl: 1.59, asda: 1.46, sainsbury: 1.50, morrisons: 1.50 },
  { id: 8,  name: 'Extra-Virgin Olive Oil (Bottle)', tesco: 3.50, aldi: 2.99, lidl: 2.75, asda: 3.10, sainsbury: 3.25, morrisons: 3.40 },
  { id: 9,  name: 'Free Range Butter (250g)',        tesco: 2.10, aldi: 1.85, lidl: 1.79, asda: 1.95, sainsbury: 2.05, morrisons: 2.00 },
  { id: 10, name: 'Basmati Rice (1Kg)',              tesco: 1.80, aldi: 1.50, lidl: 1.45, asda: 1.65, sainsbury: 1.75, morrisons: 1.70 },
  { id: 11, name: 'Pasta (500g)',                    tesco: 0.85, aldi: 0.69, lidl: 0.65, asda: 0.75, sainsbury: 0.80, morrisons: 0.79 },
  { id: 12, name: 'Tinned Tomatoes (400g)',          tesco: 0.60, aldi: 0.45, lidl: 0.42, asda: 0.55, sainsbury: 0.58, morrisons: 0.55 },
  { id: 13, name: 'Cheddar Cheese (400g)',           tesco: 2.75, aldi: 2.29, lidl: 2.35, asda: 2.50, sainsbury: 2.80, morrisons: 2.65 },
  { id: 14, name: 'Chicken Breast Fillets (600g)',   tesco: 3.79, aldi: 3.19, lidl: 3.29, asda: 3.49, sainsbury: 3.89, morrisons: 3.65 },
  { id: 15, name: 'Frozen Peas (900g)',              tesco: 1.29, aldi: 0.99, lidl: 1.05, asda: 1.19, sainsbury: 1.35, morrisons: 1.25 },
  { id: 16, name: 'Baked Beans 4 pack',              tesco: 1.40, aldi: 1.09, lidl: 1.15, asda: 1.29, sainsbury: 1.45, morrisons: 1.35 },
  { id: 17, name: 'Greek Yoghurt (500g)',            tesco: 1.40, aldi: 0.99, lidl: 1.05, asda: 1.29, sainsbury: 1.45, morrisons: 1.35 },
  { id: 18, name: 'Salmon Fillets (2 pack)',         tesco: 3.75, aldi: 3.29, lidl: 3.35, asda: 3.50, sainsbury: 3.85, morrisons: 3.65 },
];

// finds the cheapest store and price  used only for highlighting, not forced as cart choice
const getBest = (product) => {
  let bestPrice = Infinity;
  let bestStore = '';
  STORES.forEach((s) => {
    if (product[s] != null && product[s] < bestPrice) {
      bestPrice = product[s];
      bestStore = s;
    }
  });
  const regularPrice = Math.max(...STORES.map((s) => product[s] ?? 0));
  return { bestPrice, bestStore, regularPrice };
};

const DEALS = ALL_PRODUCTS.filter((p) => getBest(p).bestPrice < 1.50);

export default function PriceComparison() {
  const { items, addItem, removeItem } = useCart();
  const [activeTab,   setActiveTab]   = useState('popular');
  const [search,      setSearch]      = useState('');
  // tracks which store the user clicked per product  defaults to cheapest
  const [storeChoice, setStoreChoice] = useState({});

  const inBasket         = new Set(items.map((i) => i.id));
  const filteredProducts = ALL_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const basketRegularTotal = items.reduce((sum, i) => sum + i.regularPrice * i.quantity, 0);
  const basketCartyTotal   = items.reduce((sum, i) => sum + i.bestPrice   * i.quantity, 0);
  const basketCartySaving  = items.reduce((sum, i) => sum + (i.regularPrice - i.bestPrice) * i.quantity, 0);

  const getProducts = () => {
    if (activeTab === 'basket') return items;
    if (activeTab === 'deals')  return DEALS;
    return filteredProducts;
  };

  // add to cart at whichever store the user selected  defaults to cheapest if they haven't clicked one
  const handleAdd = (product) => {
    const { bestPrice, bestStore, regularPrice } = getBest(product);
    const chosenStore = storeChoice[product.id] || bestStore;
    const chosenPrice = product[chosenStore] ?? bestPrice;
    addItem({ ...product, bestPrice: chosenPrice, bestStore: chosenStore, regularPrice });
  };

  return (
    <div className="price-page">
      <div className="price-page__card container">
        <h1 className="price-page__title">Compare Prices Across Your Favorite Supermarkets</h1>

        {/* search bar */}
        <div className="price-search">
          <button className="price-search__btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Search
          </button>
          <input
            type="text"
            className="price-search__input"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* tabs */}
        <div className="price-tabs">
          {['popular', 'basket', 'deals'].map((tab) => (
            <button
              key={tab}
              className={`price-tab ${activeTab === tab ? 'price-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'popular' ? 'Popular Items' : tab === 'basket' ? 'Your Basket' : 'Deals For you'}
            </button>
          ))}
        </div>

        {/* store-pick hint */}
        {activeTab === 'popular' && (
          <p className="price-pick-hint">
            💡 Click any store column to choose where to add from. Orange = cheapest.
          </p>
        )}

        {/* comparison table */}
        <div className="price-table-wrapper">
          <table className="price-table">
            <thead>
              <tr>
                <th className="price-table__col-product">Products</th>
                {STORES.map((s) => <th key={s}>{STORE_LABELS[s]}</th>)}
                <th>Best Price</th>
                <th>{activeTab === 'basket' ? 'Remove' : 'Add'}</th>
              </tr>
            </thead>
            <tbody>
              {getProducts().length === 0 && (
                <tr>
                  <td colSpan={9} className="price-table__empty">
                    {activeTab === 'basket' ? 'Your basket is empty — add items from Popular Items' : 'No items found'}
                  </td>
                </tr>
              )}
              {getProducts().map((product) => {
                const { bestPrice, bestStore } = getBest(product);
                const chosen = storeChoice[product.id] || bestStore;

                return (
                  <tr key={product.id}>
                    <td className="price-table__col-product">{product.name}</td>

                    {STORES.map((s) => {
                      const price    = product[s];
                      const isBest   = s === bestStore;
                      // show the user's selection highlight only when not yet in basket
                      const isChosen = s === chosen && !inBasket.has(product.id) && !isBest && activeTab !== 'basket';
                      return (
                        <td
                          key={s}
                          className={isBest ? 'price-table__best-cell' : isChosen ? 'price-table__chosen-cell' : ''}
                          onClick={() => {
                            if (activeTab !== 'basket' && !inBasket.has(product.id)) {
                              setStoreChoice((prev) => ({ ...prev, [product.id]: s }));
                            }
                          }}
                          style={{ cursor: activeTab !== 'basket' && !inBasket.has(product.id) ? 'pointer' : 'default' }}
                          title={activeTab !== 'basket' ? `Add from ${STORE_LABELS[s]}` : ''}
                        >
                          {isBest
                            ? <span className="price-badge">£{price?.toFixed(2)}</span>
                            : `£${price?.toFixed(2)}`
                          }
                        </td>
                      );
                    })}

                    <td><span className="price-badge">£{bestPrice.toFixed(2)}</span></td>

                    <td>
                      {activeTab === 'basket' ? (
                        <button className="price-action-btn price-action-btn--remove" onClick={() => removeItem(product.id)}>
                          − Remove
                        </button>
                      ) : inBasket.has(product.id) ? (
                        <button className="price-action-btn price-action-btn--added" onClick={() => removeItem(product.id)}>
                          ✓ Added
                        </button>
                      ) : (
                        <button className="price-action-btn" onClick={() => handleAdd(product)}>
                          + {STORE_LABELS[chosen]}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* basket summary bar */}
        {activeTab === 'basket' && items.length > 0 && (
          <>
            <div className="price-summary">
              <div className="price-summary__block">
                <span className="price-summary__amount">£{basketRegularTotal.toFixed(2)}</span>
                <span className="price-summary__label">total basket</span>
              </div>
              <div className="price-summary__block">
                <span className="price-summary__amount">£{basketCartyTotal.toFixed(2)}</span>
                <span className="price-summary__label">Carty optimised</span>
              </div>
              <div className="price-summary__block price-summary__block--save">
                <span className="price-summary__amount">£{basketCartySaving.toFixed(2)}</span>
                <span className="price-summary__label">you save</span>
              </div>
            </div>
            <button className="price-create-list-btn">Create My Shopping List</button>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
