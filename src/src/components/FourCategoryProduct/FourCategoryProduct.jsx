import React from 'react';
import './FourCategoryProduct.css';
import Button from '../Button/Button';

const FourCategoryProduct = ({ header, description }) => {
    return (
        <div className='categoryBoxes'>
            <h3>{header}</h3>
            <div className='prdList'>
                {description.map((item, index) => (
                    <div className="product" key={index}>
                        <img src={item.image} alt="Product Services" />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
            <Button
                type="button"
                value="Explore now"
                varient="explore"
                space="sp-10"
            />
        </div>
    )
}

export default FourCategoryProduct