import React, { useEffect, useState } from 'react'
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
    const initialImage = homeProductData?.banners[0]?.banner_image || bannerList[0]?.banner_image || "/images/banner/web_banner.jpg";
    const [imageUrl, setImageUrl] = useState(initialImage);
    
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
        useEffect(() => {
            if (homeProductData?.banners?.length > 0) {
                setImageUrl(homeProductData.banners[0].banner_image);
            }
        }, [homeProductData]);
      
      useEffect(() => {
        if (!imageUrl) return;
        
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = imageUrl;
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, [imageUrl]);
    return (
        <div className="bannerContainer">
            <div className="bannerContent">
                <Slider {...slick_banner_settings}>
                    {homeProductData?.banners && homeProductData?.banners.map((item, index) => (
                        <div key={index}  onClick={() => handleProductClick(item?.name, item?.id)}>
                            <img src={item.banner_image} alt={item.name} />
                        </div>
                    ))}
                    {!homeProductData?.banners?.length && (
                        <div>
                            <img src={imageUrl} alt={imageUrl} />
                        </div>
                    )}
                    {/* {!homeProductData && bannerList && bannerList.map((item, index) => (
                        <div key={index}>
                            <img src={item.banner_image} alt={item.name} />
                        </div>
                    ))} */}
                </Slider>
            </div>
        </div>
    )
}

export default Banner;