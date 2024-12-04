import React from 'react';
import './ProductCard.css';

const ProductCard = ({ imgSrc, imgName, handleCategory, id }) => {
  return (
    <div className='product' onClick={handleCategory} id={id}>
        <img src={imgSrc} alt={imgName} />
        <p>{imgName}</p>
    </div>
  )
}

export default ProductCard