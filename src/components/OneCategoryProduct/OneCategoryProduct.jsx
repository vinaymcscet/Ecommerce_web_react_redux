import React from 'react';
import './OneCategoryProduct.css';
import Button from '../Button/Button';

const OneCategoryProduct = ({ header, description }) => {
    return (
        <div className='categoryBoxes oneProduct'>
            <h3>{header}</h3>
            <div className='prdList'>
                {description.map((item, index) => (
                    <div className="product" key={index}>
                        <img src={item.image} alt="Product Services" />
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

export default OneCategoryProduct;