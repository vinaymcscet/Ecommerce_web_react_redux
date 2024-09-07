import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ imgSrc, imgName }) => {
  return (
    <div className='categoryItem'>
        <img src={imgSrc} alt={imgName} />
        <p>{imgName}</p>
    </div>
  )
}

export default CategoryCard