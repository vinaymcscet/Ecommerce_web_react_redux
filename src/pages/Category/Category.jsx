import React from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { allCategory } from "../../utils/ProductData";
import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategoryModal } from "../../store/slice/modalSlice";
import "./Category.css";

const Category = () => {
  const dispatch = useDispatch();
  const { productHistory, allCategories } = useSelector(
    (state) => state.product
  );
  console.log(allCategories);

  const handleCategory = (item) => {
    console.log(item);
    dispatch(toggleCategoryModal({ isOpen: true, category: item }));
  };
  return (
    <div className="allCategory">
      {allCategories && allCategories.length > 0 ? (
        <>
          <h3>Main Category</h3>
          <div className="categoryList">
            {allCategories[0].map((slide, index) => (
              <div key={index}>
                <ProductCard
                  imgSrc={slide.img}
                  imgName={slide.PrdName}
                  handleCategory={() => handleCategory(slide)}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No Category available</p>
      )}
      <div className="productHistory">
        <h3>Frequently bought</h3>
        <div className="productList">
          {productHistory && productHistory.length > 0 ? (
            productHistory[0].map((item, index) => (
              <div key={index}>
                <ProductListCard
                  id={item.id}
                  image={item.image ? item.image : ""}
                  name={item.name ? item.name : ""}
                  userrating={item.rating ? item.rating : ""}
                  discountPrice={item.discount ? item.discount : ""}
                  originalPrice={item.original ? item.original : ""}
                  save={item.save ? item.save : ""}
                  coupenCode={item.coupen ? item.coupen : ""}
                  deliveryTime={item.deliverytime ? item.deliverytime : ""}
                  freeDelivery={item.freedelivery ? item.freedelivery : ""}
                  bestSeller={item.bestseller ? item.bestseller : ""}
                  time={item.time ? item.time : ""}
                  discountLabel={item.discountlabel ? item.discountlabel : ""}
                />
              </div>
            ))
          ) : (
            <p>No product history available</p>
          )}
        </div>
      </div>
      <div className="productHistory">
        <h3>Inspired by your browsing history</h3>
        <div className="productList">
          {productHistory && productHistory.length > 0 ? (
            productHistory[0].map((item, index) => (
              <div key={index}>
                <ProductListCard
                  id={item.id}
                  image={item.image ? item.image : ""}
                  name={item.name ? item.name : ""}
                  userrating={item.rating ? item.rating : ""}
                  discountPrice={item.discount ? item.discount : ""}
                  originalPrice={item.original ? item.original : ""}
                  save={item.save ? item.save : ""}
                  coupenCode={item.coupen ? item.coupen : ""}
                  deliveryTime={item.deliverytime ? item.deliverytime : ""}
                  freeDelivery={item.freedelivery ? item.freedelivery : ""}
                  bestSeller={item.bestseller ? item.bestseller : ""}
                  time={item.time ? item.time : ""}
                  discountLabel={item.discountlabel ? item.discountlabel : ""}
                />
              </div>
            ))
          ) : (
            <p>No product history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
