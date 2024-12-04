import React, { useState } from 'react';
import StarRating from '../StarRating/StarRating';
import './ProductListCard.css';

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
}) => {
  const [whistListBox, setWhistListBox] = useState({
    whistlist: "/images/product/whistlist.svg",
    whistlistFill: "/images/product/whistlist-fill.svg",
  });
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
      {image && <img src={image} alt={name} />}
      {name && <h2>{name.length > 50 ? `${name.slice(0, 50)}...` : name}</h2>}
      {userrating && <StarRating userrating={userrating} />}
      
      <div className='priceList'>
        {discountPrice && <p className='discount'>£ {discountPrice}</p>}
        {originalPrice && <p className='original'>£ {originalPrice}</p>}
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
