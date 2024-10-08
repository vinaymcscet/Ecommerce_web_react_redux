import React, { useEffect, useState } from "react";
import Banner from "../../components/Banner/Banner";
import { BannerOfferData } from "../../utils/BannerOfferData";
import "./Home.css";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import FourCategoryProduct from "../../components/FourCategoryProduct/FourCategoryProduct";
import {
  allCategory,
  categorySlides,
  description,
  Onedescription,
  productHistoryList,
} from "../../utils/ProductData";
import OneCategoryProduct from "../../components/OneCategoryProduct/OneCategoryProduct";
import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { setAllCategories, setCategorySlide, setProductHistory, setProductList } from "../../store/slice/productSlice";
import { productBulkList } from "../../utils/ProductData";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slice/userSlice";
import { User } from "../../utils/CommonUtils";

const Home = () => {
  const dispatch = useDispatch();
  const [productTile, setProductTile] = useState(true);
  useEffect(() => {
    dispatch(setProductHistory(productHistoryList));
    dispatch(setProductList(productBulkList));
    dispatch(setCategorySlide(categorySlides))
    dispatch(setAllCategories(allCategory))
    // dispatch(setUser(User))
  }, [dispatch]);

  const { productHistory } = useSelector((state) => state.product);

  return (
    <div>
      <Banner props={BannerOfferData} />
      <ProductSlider title={productTile} />
      <div className="fourCategoryProduct">
        <FourCategoryProduct
          header="Appliances for your home Up to 55% off"
          description={description}
        />
        <FourCategoryProduct
          header="Starting $99 | International Brands & more"
          description={description}
        />
        <FourCategoryProduct
          header="Up to 70% off | Bestseller Smart Phone"
          description={description}
        />
        <FourCategoryProduct
          header="Automative essentials | Up to 60% off"
          description={description}
        />
        <OneCategoryProduct
          header="Automative essentials | Up to 60% off"
          description={Onedescription}
        />
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
      </div>
      <div className="productList">
        <ProductListCard
          image={"/images/product/img-13.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-14.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-15.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-16.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <div className="limitedOffer">
          <img src="/images/limitedOffer.png" alt="Limited Offer" />
        </div>
      </div>
      <div className="fourCategoryProduct">
        <OneCategoryProduct
          header="Automative essentials | Up to 60% off"
          description={Onedescription}
        />
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
      </div>
      <div className="productList">
        <div className="limitedOffer">
          <img src="/images/limitedOffer.png" alt="Limited Offer" />
        </div>
        <ProductListCard
          image={"/images/product/img-13.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-14.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-15.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
        <ProductListCard
          image={"/images/product/img-16.svg"}
          name={
            "Glen Active Electric Nutri Blender 350 watt | 2 Interchangable Jars"
          }
          discountPrice={"105100"}
          originalPrice={"1790.00"}
          discountLabel={"47% Off"}
          time={"Limited time Deal"}
        />
      </div>
      <div className="groupBanner">
        <img src="/images/groupBanner.svg" alt="Banner Poster" />
      </div>
      <div className="fourCategoryProduct">
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
        <FourCategoryProduct
          header="Men's Shoes | Up to 60% off | Limited Stock"
          description={description}
        />
        <OneCategoryProduct
          header="Automative essentials | Up to 60% off"
          description={Onedescription}
        />
      </div>
      <div className="browisingHistory">
        <h3>Inspired by your browsing history</h3>
      </div>
      <div className="productHistory">
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

export default Home;
