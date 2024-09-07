import React from 'react';
import './ProductCard.css';

const ProductCard = ({ imgSrc, imgName, handleCategory }) => {
  return (
    <div className='product' onClick={handleCategory}>
        <img src={imgSrc} alt={imgName} />
        <p>{imgName}</p>
    </div>
  )
}

export default ProductCard