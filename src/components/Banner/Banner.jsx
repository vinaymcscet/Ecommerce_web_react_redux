import React from 'react'
import Slider from "react-slick"
import { bannerList, slick_banner_settings } from '../../utils/ProductData';
import './Banner.css';

const Banner = ({ props }) => {
    return (
        <div className="bannerContainer">
            <div className="bannerContent">
                <Slider {...slick_banner_settings}>
                    {bannerList && bannerList.map((item, index) => (
                        <div key={index}>
                            <img src={item.name} alt={item.alt} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default Banner;