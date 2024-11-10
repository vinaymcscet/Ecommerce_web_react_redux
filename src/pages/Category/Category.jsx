import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategoryModal } from "../../store/slice/modalSlice";
import "./Category.css";
import { getAllCategoryData, getAllListProductAPI, getAllRecentViewData, getSubCategoryData } from "../../store/slice/api_integration";

const Category = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const { allCategoryList, subCategoryList, recentView } = useSelector(
    (state) => state.product
  );
  
  const handleCategory = (item) => {
    const responseObj = { category_id: item.id };
    dispatch(getSubCategoryData(responseObj))
    const subCategoryObj = { 
      isOpen: isOpen, 
      category: subCategoryList, 
      category_name: item.name,
    };
    dispatch(toggleCategoryModal(subCategoryObj));
    
  };
  useEffect(() => {
    dispatch(getAllCategoryData())
    dispatch(getAllRecentViewData(0, 10));
  }, [dispatch]);

  console.log("recentView", recentView);
  
  return (
    <div className="allCategory">
      {allCategoryList[0] && allCategoryList[0].length > 0 ? (
        <>
          <h3>Main Category</h3>
          <div className="categoryList">
            {allCategoryList[0].map((slide, index) => (
              <div key={index}>
                <ProductCard
                  id = {slide?.id}
                  imgSrc={slide?.category_image || '/images/no-product-available.jpg'}
                  imgName={slide?.name}
                  handleCategory={() => handleCategory(slide)}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="notAvailable">No Category available</p>
      )}
      <div className="productHistory">
        <h3>Frequently bought</h3>
        <div className="productList">
          {recentView && recentView.length > 0 ? (
            recentView.map((item, index) => (
              <div key={index}>
                <ProductListCard
                  id={item.id}
                  image={item.imageUrl ? item.imageUrl : ""}
                  name={item.name ? item.name : ""}
                  userrating={item.rating ? item.rating : ""}
                  discountPrice={item.discountedPrice ? item.discountedPrice : ""}
                  originalPrice={item.price ? item.price : ""}
                  save={item.offer ? item.offer : ""}
                  coupenCode={item.coupen ? item.coupen : ""}
                  deliveryTime={item.deliverytime ? item.deliverytime : ""}
                  freeDelivery={item.freedelivery ? item.freedelivery : ""}
                  bestSeller={item.bestseller ? item.bestseller : ""}
                  time={item.time ? item.time : ""}
                  discountLabel={item.discountlabel ? item.discountlabel : ""}
                  wishlistStatus={item.wishlistStatus ? item.wishlistStatus : 'no'}
                />
              </div>
            ))
          ) : (
            <p className="notAvailable">No product history available</p>
          )}
        </div>
      </div>
      <div className="productHistory">
        <h3>Inspired by your browsing history</h3>
        <div className="productList">
          {recentView && recentView.length > 0 ? (
            recentView.map((item, index) => (
              <div key={index}>
                <ProductListCard
                  id={item.id}
                  image={item.imageUrl ? item.imageUrl : ""}
                  name={item.name ? item.name : ""}
                  userrating={item.rating ? item.rating : ""}
                  discountPrice={item.discountedPrice ? item.discountedPrice : ""}
                  originalPrice={item.price ? item.price : ""}
                  save={item.offer ? item.offer : ""}
                  coupenCode={item.coupen ? item.coupen : ""}
                  deliveryTime={item.deliverytime ? item.deliverytime : ""}
                  freeDelivery={item.freedelivery ? item.freedelivery : ""}
                  bestSeller={item.bestseller ? item.bestseller : ""}
                  time={item.time ? item.time : ""}
                  discountLabel={item.discountlabel ? item.discountlabel : ""}
                  wishlistStatus={item.wishlistStatus ? item.wishlistStatus : 'no'}
                />
              </div>
            ))
          ) : (
            <p className="notAvailable">No product history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
