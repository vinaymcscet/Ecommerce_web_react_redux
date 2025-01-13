import React, { useEffect, useState } from 'react';
import StarRating from '../StarRating/StarRating';
import './ProductListCard.css';
import { useSelector } from 'react-redux';

const ProductListCard = ({ 
  id,
  image, 
  name, 
  userrating, 
  discountPrice, 
  originalPrice, 
  discountLabel, 
  time,
  save,
  coupenCode,
  deliveryTime,
  freeDelivery,
  bestSeller,
  wishlistStatus,
  sku_id,
  onAddToCart,
  onProductClick,
  onIncrement,
  onDecrement,
  cartQuantity,
  offer,
  onProductImageClick,
}) => {
  const [whistListBox, setWhistListBox] = useState({
    whistlist: "/images/product/whistlist.svg",
    whistlistFill: "/images/product/whistlist-fill.svg",
  });
  const { user } = useSelector((state) => state.user);

  // const handleIncrement = () => setQuantity((prevQuantity) => prevQuantity + 1);
  // const handleDecrement = () => setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 0));

  return (
    <div className='productBoxes' key={id}>
      <div className="whislistBox">
        <div className="wishlist-btn">
          {wishlistStatus?.toLowerCase() === 'yes' ? (
            <img
              src={whistListBox.whistlistFill}
              alt="Whistlist Product"
            />
          ) : (
            <img src={whistListBox.whistlist} alt="Whistlist Product" />
          )}
        </div>
      </div>
      {image && <img src={image} alt={name} onClick={onProductImageClick}  />}
      {/* {image && <img src={image} alt={name} onClick={onProductClick}  />} */}
      {name && <h2>{name.length > 50 ? `${name.slice(0, 50)}...` : name}</h2>}
      <div className='priceList'>
        {discountPrice && <p className='discount'>£ {discountPrice}</p>}
        {originalPrice && <p className='original'>£ {originalPrice}</p>}
      </div>
      <div className='ratingAndCartWrap'>
        {userrating && <StarRating userrating={userrating} />}
        {offer ? null : (
            cartQuantity === 0 ? (
            // Show Add Button if quantity is 0
            <button type="button" onClick={() => onAddToCart(sku_id)} 
              // disabled={user.length === 0 ? true : false} 
              title={user.length === 0 ? 'Please login to add items to cart.' : 'Add to cart'}
              >Add</button>
          ) : (
            <button type="button" onClick={() => onProductClick()} 
              // disabled={user.length === 0 ? true : false} 
              title={user.length === 0 ? 'Please login to add items to cart.' : 'Add to cart'}
              >Add</button>
            // Show Plus/Minus Buttons if quantity is greater than 0
            // <div className="quantityButtons">
            //   <button type="button"  onClick={() => onIncrement(sku_id)}>+</button>
            //   <span>{cartQuantity}</span>
            //   <button type="button" onClick={() => onDecrement(sku_id)}>-</button>
            // </div>
          )
        )}
      </div>
      
      {(discountLabel || time || save || coupenCode) && (
        <div className={`offerList ${save ? 'saveMode' : ''}`}>
          {discountLabel && <span>{discountLabel}</span>}
          {time && <h6>{time}</h6>}
          {coupenCode && <p>{coupenCode}</p>}
        </div>
      )}

      {deliveryTime && <p>{deliveryTime}</p>}
      {freeDelivery && <p>{freeDelivery}</p>}
      {bestSeller && <div className="ribbon">#Best Seller</div>}
    </div>
  );
};

export default ProductListCard;
