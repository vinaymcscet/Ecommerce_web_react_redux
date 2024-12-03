import React from 'react'
import Slider from "react-slick"
import { bannerList, slick_banner_settings } from '../../utils/ProductData';
import './Banner.css';
import { useSelector } from 'react-redux';

const Banner = () => {
    const { homeProductData } = useSelector(state => state.product);
    return (
        <div className="bannerContainer">
            <div className="bannerContent">
                <Slider {...slick_banner_settings}>
                    {homeProductData?.banners && homeProductData?.banners.map((item, index) => (
                        <div key={index}>
                            <img src={item.banner_image} alt={item.name} />
                        </div>
                    ))}
                    {!homeProductData && bannerList && bannerList.map((item, index) => (
                        <div key={index}>
                            <img src={item.banner_image} alt={item.name} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default Banner;