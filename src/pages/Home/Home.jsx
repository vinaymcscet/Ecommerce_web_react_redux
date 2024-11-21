import React, { useEffect, useMemo, useState } from "react";
import Banner from "../../components/Banner/Banner";
import "./Home.css";
import ProductSlider from "../../components/ProductSlider/ProductSlider";

import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { useDispatch, useSelector } from "react-redux";
import { getHomeData, getHomeSection } from "../../store/slice/api_integration";
import { formatDate } from "../../utils/FormatDateTime";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { homeProductData, homeProductSection } = useSelector(state => state.product);
  const [productTile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getHomeData())
    dispatch(getHomeSection(0, 20))
  }, [dispatch]);

  
  const handleProductClick = (item) => {
    navigate(`/product/${item.id}`, { state: { product: item } });
  };

  return (
    <div>
      <Banner />
      <ProductSlider title={productTile} />
      {/* <div className="fourCategoryProduct">
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
      </div> */}
      {/* <div className="productList">
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
      </div> */}
      {/* <div className="fourCategoryProduct">
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
      </div> */}
      <div className="productList special">
        {homeProductData[0]?.offers && <div className="limitedOffer">
          <img src="/images/limitedOffer.png" alt="Limited Offer" />
        </div>}
        {homeProductData[0]?.offers && homeProductData[0]?.offers.map((item, index) => (
          <div key={index} onClick={() => handleProductClick(item)}>
            <ProductListCard
              id = {item?.categoryId}
              image={item?.categoryImage}
              name={item?.categoryName}
              // discountPrice={"105100"}
              // originalPrice={"1790.00"}
              discountLabel={item?.title}
              time={`valid till ${formatDate(item.validTill)}`}
              wishlistStatus={item.wishlistStatus ? item.wishlistStatus : 'no'}
            />
          </div>
        ))}
        {/* <ProductListCard
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
        /> */}
      </div>
      <div className="productHistory">
          {homeProductSection[0] && homeProductSection[0].length > 0 ? (
                    homeProductSection[0].map((item, index) => (
                      <div key={index}>
                        <div className="browisingHistory">
                          <h3>{item.title}</h3>
                        </div>
                          <div className="productList">
                          {item?.products.map((product, index) => (
                            <div key={index} onClick={() => handleProductClick(product)}>
                              <ProductListCard
                                id={product?.group_id}
                                image={product.imageUrl ? product.imageUrl : "/images/no-product-available.png"}
                                name={product.name ? product.name : ""}
                                userrating={product.rating ? product.rating : ""}
                                discountPrice={product.discountedPrice ? product.discountedPrice : ""}
                                originalPrice={product.price ? product.price : ""}
                                save={product.offer ? product.offer : ""}
                                coupenCode={product.coupen ? product.coupen : ""}
                                deliveryTime={product.deliverytime ? product.deliverytime : ""}
                                freeDelivery={product.freedelivery ? item.freedelivery : ""}
                                bestSeller={item.bestseller ? product.bestseller : ""}
                                time={product.time ? product.time : ""}
                                discountLabel={product.offer ? product.offer : ""}
                                wishlistStatus={item.wishlistStatus ? item.wishlistStatus : 'no'}
                              />
                            </div>
                          ))}
                          </div>
                      </div>
                    ))
            ) : (
              <p>No products available</p>
            )}
      </div>
      <div className="groupBanner">
        <img src={homeProductData[0]?.bottomBanner[0]?.banner_image} alt={homeProductData[0]?.bottomBanner[0]?.name} />
      </div>
      {/* <div className="fourCategoryProduct">
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
      </div> */}
      <div className="browisingHistory">
        <h3>Inspired by your browsing history</h3>
      </div>
      <div className="productHistory">
        <div className="productList">
          {homeProductData[0]?.RecentViewed && homeProductData[0]?.RecentViewed.length > 0 ? (
            homeProductData[0]?.RecentViewed.map((item, index) => (
              <div key={index} onClick={() => handleProductClick(item)}>
                <ProductListCard
                  id={index}
                  image={item.imageUrl ? item.imageUrl : "/images/no-product-available.png"}
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
                  discountLabel={item.offer ? item.offer : ""}
                  wishlistStatus={item.wishlistStatus ? item.wishlistStatus : 'no'}
                />
              </div>
            ))
          ) : (
            <p className="noProductAvailable">No product history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
