import React from 'react';
import './ProductListCard.css';
import StarRating from '../StarRating/StarRating';

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
  bestSeller
}) => {
  return (
    <div className='productBoxes' key={id}>
      {image && <img src={image} alt={name} />}
      {name && <h2>{name}</h2>}
      {userrating && <StarRating userrating={userrating} />}
      
      <div className='priceList'>
        {discountPrice && <p className='discount'>$ {discountPrice}</p>}
        {originalPrice && <p className='original'>$ {originalPrice}</p>}
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
