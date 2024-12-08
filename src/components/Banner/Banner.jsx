import React, { useState } from 'react'
import Slider from "react-slick"
import { bannerList, slick_banner_settings } from '../../utils/ProductData';
import './Banner.css';
import { useDispatch, useSelector } from 'react-redux';
import { getSubCategoryData } from '../../store/slice/api_integration';
import { toggleCategoryModal } from '../../store/slice/modalSlice';

const Banner = () => {
    const { homeProductData, subCategoryList } = useSelector(state => state.product);
    const [isOpen] = useState(true);
    const dispatch = useDispatch();
    
    const handleProductClick = (title, banner_id = 0) => {
        const responseObj = { category_id: banner_id };
        dispatch(getSubCategoryData(responseObj))
        const subCategoryObj = { 
            isOpen: isOpen, 
            category: subCategoryList, 
            category_name: title,
        };
        dispatch(toggleCategoryModal(subCategoryObj));
    }
    return (
        <div className="bannerContainer">
            <div className="bannerContent">
                <Slider {...slick_banner_settings}>
                    {homeProductData?.banners && homeProductData?.banners.map((item, index) => (
                        <div key={index}  onClick={() => handleProductClick(item?.name, item?.id)}>
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