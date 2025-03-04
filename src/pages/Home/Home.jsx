import React, { useEffect, useMemo, useState } from "react";
import Banner from "../../components/Banner/Banner";
import "./Home.css";
import ProductSlider from "../../components/ProductSlider/ProductSlider";

import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { useDispatch, useSelector } from "react-redux";
import { addProductOnWhistList, addToCartData, deleteSingleWhistListData, getHomeData, getHomeSection, viewItemsInCartData } from "../../store/slice/api_integration";
import { formatDate } from "../../utils/FormatDateTime";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { setViewCartItems } from "../../store/slice/cartSlice";
import { shuffleProduct } from "../../utils/ShuffleProduct";
import { toggleModal } from "../../store/slice/modalSlice";
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const dispatch = useDispatch();
  const { homeProductData, homeProductSection } = useSelector(state => state.product);
  const [productTile] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [triggerSkuId, setTriggerSkuId] = useState(null);
  const [randomProducts, setRandomProducts] = useState([]);
  const { user } = useSelector((state) => state.user);
  
  const [page, setPage] = useState(1);
  useEffect(() => {
      navigate("/", { replace: true });
  }, [navigate]);
  // const [dataLoading, setDataLoading] = useState(false);

  // const handleScroll = () => {
  //   if (
  //     document.body.scrollHeight - 630 <
  //     window.scrollY + window.innerHeight
  //   ) {
  //     setDataLoading(true);
  //   }
  // };

  // function debounce(func, delay) {
  //   let timeoutId;
  //   return function (...args) {
  //     if (timeoutId) {
  //       clearTimeout(timeoutId);
  //     }
  //     timeoutId = setTimeout(() => {
  //       func(...args);
  //     }, delay);
  //   };
  // }

  // window.addEventListener("scroll", debounce(handleScroll, 500));
  // useEffect(() => {
  //   if (dataLoading == true) {
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // }, [dataLoading]);

  useEffect(() => {
    setLoading(true)
    dispatch(getHomeData())
    const responseObj = {
      offset: page,
      limit: 1000
    }
    dispatch(getHomeSection(responseObj)).finally(() => {
      setLoading(false);
      // setDataLoading(false);
    })
  }, [dispatch]);
  
  const handleProductClick = (item) => {
    if(user.length === 0) {
      dispatch(toggleModal(true));
    } else {
      navigate(`/product/${item.product_id}`, { state: { product: item } });
    }
  };

  const handleProcuctImageClick = (item) => {
    navigate(`/product/${item.product_id}`, { state: { product: item } });
  }

  const handleSectionPage = (title, group_id = 0) => {
    navigate(`/sectionDetail/${group_id}?title=${encodeURIComponent(title)}`)
  }

  const handleAddToCartClick = (sku_id) => {
      setTriggerSkuId(sku_id);
      const responseObj = {
        sku_id,
        type: "increase",
      };
      dispatch(addToCartData(responseObj)).finally(() => {
        fetchUpdatedProductList();
      })
  };
  const handleIncrement = (sku_id) => {
    const responseObj = { sku_id, type: "increase" };
    dispatch(addToCartData(responseObj)).finally(() => {
      fetchUpdatedProductList();
    });
  };

  const handleDecrement = (sku_id) => {
    const responseObj = { sku_id, type: "decrease" };
    dispatch(addToCartData(responseObj)).finally(() => {
      fetchUpdatedProductList();
    });
  };

  const fetchUpdatedProductList = () => {
    setLoading(true);
    dispatch(getHomeData())
    const responseObj = {
      offset: page,
      limit: 1000
    }
    dispatch(getHomeSection(responseObj)).finally(() => {
      setLoading(false);
      // setDataLoading(false);
    })
    dispatch(viewItemsInCartData());
    dispatch(setViewCartItems(null));
  };

  useEffect(() => {
    if (homeProductSection && homeProductSection.length > 0) {
      const updatedSections = homeProductSection.map((section) => ({
        ...section,
        products: shuffleProduct(section.products).slice(0, 5),
      }));
      setRandomProducts(updatedSections);
    }
  }, [homeProductSection]);

  const handleWishlistToggle = (productData) => {
    if(user.length === 0) {
      dispatch(toggleModal(true));
      // setWishlistLoading(false);
      return;
    }

    const responseObj = { sku_id: Number(productData?.sku_id) }
    if(productData?.wishlistStatus?.toLowerCase() === 'no') {
      dispatch(addProductOnWhistList(responseObj)).finally(() => {
        fetchUpdatedProductList();
        // setWishlistLoading(false);
      })
    } else {
        dispatch(deleteSingleWhistListData(responseObj)).finally(() => {
          fetchUpdatedProductList();
          // setWishlistLoading(false);
        })
    }
  }
  const currentUrl = window.location.href;
  const baseUrl = window.origin;
  return (
    <div>
      {/* SEO Meta Tags */}
      <Helmet>
          <title>{'FikFis | Discover  Latest Clothing, Beauty, Home, Jewelry, Fashion, Beauty & Lifestyle in One Place'}</title>
          <meta name="description" content={'Welcome to FikFis, your ultimate destination for top-quality products across multiple categories! Shop online at unbeatable prices on everything you need.'} />
          <meta name="keywords" content={'FikFis | Home'} />
          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:title" content={'FikFis | Discover  Latest Clothing, Beauty, Home, Jewelry, Fashion, Beauty & Lifestyle in One Place'} />
          <meta property="og:description" content={'Welcome to FikFis, your ultimate destination for top-quality products across multiple categories! Shop online at unbeatable prices on everything you need.'} />
          <meta property="og:image" content={homeProductData?.banners[0]?.banner_image || `${baseUrl}/images/icons/LOGO1.png`} />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:type" content="article" />
          {/* <!-- Twitter --> */}
          <meta property="twitter:card" content="article" />
          <meta property="twitter:url" content={currentUrl} />
          <meta property="twitter:title" content="FikFis | Discover  Latest Clothing, Beauty, Home, Jewelry, Fashion, Beauty & Lifestyle in One Place" />
          <meta property="twitter:description" content="Welcome to FikFis, your ultimate destination for top-quality products across multiple categories! Shop online at unbeatable prices on everything you need." />
          <meta property="twitter:image" content={homeProductData?.banners[0]?.banner_image || `${baseUrl}/images/icons/LOGO1.png`} />
      </Helmet>
      {loading ? (
          <div className="loadingContainer">
              <CircularProgress />
          </div>
      ) : (
        <>
          <Banner />
          <ProductSlider title={productTile} />
          {/* <div className="productHistory">
            <div>
              <div className="browisingHistory">
                <h3>{homeProductData?.offerTitle}</h3>
                <div className="detailSection" 
                  onClick={() => handleSectionPage(homeProductData.offerTitle)}><img src="/images/icons/right_arrow.svg" /></div>
              </div>
            </div>
          </div> */}
          {/* Home Page Offer */}
          {/* <div className="productList special">
            {homeProductData?.offers && homeProductData?.offers.map((item, index) => (
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
                  offer={"true"}
                />
              </div>
            ))}
          </div> */}
          {/* group Banner */}
          <div className="productHistory">
              {randomProducts && randomProducts.length > 0 && (
                  randomProducts.map((item, index) => (
                    <div key={index}>
                      <div className="browisingHistory">
                        <h3>{item.title}</h3>
                        <div className="detailSection" onClick={() => handleSectionPage(item.title, item.group_id)}><img src="/images/icons/right_arrow.svg" alt="right arrow" /></div>
                      </div>
                        <div className="productList">
                        {item?.products.map((product, index) => (
                          <div key={index}>
                            <ProductListCard
                              id={product?.product_id}
                              image={product?.imageUrl ? product?.imageUrl : "/images/no-product-available.png"}
                              name={product.name || ""}
                              userrating={product.rating || "0.0"}
                              discountPrice={product?.discountedPrice || ""}
                              originalPrice={product?.price || ""}
                              save={product?.offer || ""}
                              coupenCode={product?.coupen || ""}
                              deliveryTime={product?.deliverytime || ""}
                              freeDelivery={product?.freedelivery || ""}
                              bestSeller={product?.bestseller || ""}
                              time={product?.time || ""}
                              discountLabel={product?.offer || ""}
                              wishlistStatus={product?.wishlistStatus || 'no'}
                              sku_id={product?.sku_id} // Pass SKU ID for Add to Cart
                              // onAddToCart={() => handleAddToCartClick(item.sku_id)}
                              onAddToCart={() => handleProductClick(product)}
                              cartQuantity={Number(product.cartQuantity)}
                              onIncrement={handleIncrement}
                              onDecrement={handleDecrement}
                              onProductClick={() => handleProductClick(product)}
                              onProductImageClick={() => handleProcuctImageClick(product)}
                              handleWishlistToggle={() => handleWishlistToggle(product)}
                            />
                          </div>
                        ))}
                        </div>
                    </div>
                  ))
                )}
          </div>
          <div className="groupBanner">
            <img src={homeProductData?.bottomBanner[0]?.banner_image} alt={homeProductData?.bottomBanner[0]?.name} />
          </div>
          {/* {dataLoading && (
            <div className="loadingContainer">
                <CircularProgress />
            </div>
          )} */}
          {homeProductData?.RecentViewed.length > 0 && <div className="browisingHistory">
            <h3>Inspired by your browsing history</h3>
          </div>}
          {homeProductData?.RecentViewed.length > 0 && <div className="productHistory">
            <div className="productList">
              {homeProductData?.RecentViewed && homeProductData?.RecentViewed.length > 0 &&
                homeProductData?.RecentViewed.map((item, index) => (
                  <div key={index}>
                    <ProductListCard
                      id={index}
                      image={item.imageUrl ? item.imageUrl : "/images/no-product-available.png"}
                      name={item.name || ""}
                      userrating={item.rating || "0.0"}
                      discountPrice={item.discountedPrice || ""}
                      originalPrice={item.price || ""}
                      save={item.offer ? item.offer : ""}
                      coupenCode={item.coupen || ""}
                      deliveryTime={item.deliverytime || ""}
                      freeDelivery={item.freedelivery || ""}
                      bestSeller={item.bestseller || ""}
                      time={item.time || ""}
                      discountLabel={item.offer || ""}
                      wishlistStatus={item.wishlistStatus || 'no'}
                      sku_id={item.sku_id} // Pass SKU ID for Add to Cart
                      // onAddToCart={() => handleAddToCartClick(item.sku_id)}
                      onAddToCart={() => handleProductClick(item)}
                      cartQuantity={Number(item.cartQuantity)}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      onProductClick={() => handleProductClick(item)}
                      onProductImageClick={() => handleProcuctImageClick(item)}
                      handleWishlistToggle={() => handleWishlistToggle(item)}
                    />
                  </div>
                ))
              }
            </div>
          </div>}
        </>
      )}
    </div>
  );
};

export default Home;
