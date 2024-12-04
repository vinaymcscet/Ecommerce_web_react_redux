import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ imgSrc, imgName, handleCategory, activeCategory }) => {
  console.log("categoryBoolean", activeCategory);
  
  return (
    <div 
      className={`categoryItem ${activeCategory ? 'active' : ''} `} 
      onClick={handleCategory}
    >
        <img src={imgSrc} alt={imgName} />
        <p>{imgName}</p>
    </div>
  )
}

export default CategoryCard