import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ imgSrc, imgName, handleCategory }) => {
  return (
    <div className='categoryItem' onClick={handleCategory}>
        <img src={imgSrc} alt={imgName} />
        <p>{imgName}</p>
    </div>
  )
}

export default CategoryCard