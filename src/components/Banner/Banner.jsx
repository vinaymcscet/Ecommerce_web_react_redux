import React from 'react'
import './Banner.css';

const Banner = ({ props }) => {
    return (
        <div className="bannerContainer">
            <div className="bannerContent">
                {props.map(({ title, price, type, delivery }, index) => {
                    return (
                        <div key={index}>
                            <h4>{title}</h4>
                            <h6>{price}</h6>
                            <p className='font-14'>{type}</p>
                            <p className='font-18'>{delivery}</p>
                        </div>
                    );
                })}
                <button type='button' className='shopBtn'>Shop Now</button>
            </div>
        </div>
    )
}

export default Banner;