import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CategorySlider from "../../components/CategorySlider/CategorySlider";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import ImageGallery from "react-image-gallery";
import StarRating from "../../components/StarRating/StarRating";
import LinearProgressWithLabel from "../../components/LinearProgressWithLabel/LinearProgressWithLabel";
import Button from "../../components/Button/Button";
import ProductListCard from "../../components/ProductListCard/ProductListCard";
import { useDispatch, useSelector } from "react-redux";
import { addProductOnWhistList, addReviewProductData, addReviewProductImageData, addToCartData, deleteSingleWhistListData, getAllRecentViewData, getHomeData, getReviewProductData, productDetailData, similarProductData, viewItemsInCartData } from "../../store/slice/api_integration";
import CircularProgress from '@mui/material/CircularProgress';
import "./ProductDetail.css";
// import { gaurnteeMessage } from "../../utils/CommonUtils";
import { DEFAULT_OPTIONS } from "../../utils/Constants";
import ReactPaginate from "react-paginate";
import { ShareProduct } from "../../utils/ShareProduct";
import { setViewCartItems } from "../../store/slice/cartSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    productDetailResponse, 
    getReview, 
    getReviewCount = 0, 
    getReviewImage,
    similarProductListResponse, 
    similarProductCount = 0,
    recentView,
    totalRecentView = 0,
    addToCartStatusCount,
   } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);
    
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = React.useState(0);
  const [sizeError, setSizeError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [whistListBox, setWhistListBox] = useState({
    whistlist: "/images/product/whistlist.svg",
    whistlistFill: "/images/product/whistlist-fill.svg",
    share: "/images/product/share.svg",
  });
  const [userLoggedOnWishLists, setUserLoggedOnWishList] = useState("");
  const [userLoggedOnCart, setUserLoggedOnCart] = useState("");
  const [userLoggedOnReview, setUserLoggedOnReview] = useState("");
  const [userLoggedOnBuyNow, setUserLoggedOnBuyNow] = useState("");
  const [triggerSkuId, setTriggerSkuId] = useState(null);

  // const [handleCartOnLoad, setHandleCartOnLoad] = useState(0);
  const [handleCartButtonOnLoad, setHandleCartButtonOnLoad] = useState(0);
  const [imageData, setImageData] = useState([
    { imageId: '', imageUrl: '', preview: '' },
    { imageId: '', imageUrl: '', preview: '' },
    { imageId: '', imageUrl: '', preview: '' },
    { imageId: '', imageUrl: '', preview: '' },
    { imageId: '', imageUrl: '', preview: '' },
  ]);
  const [selected, setSelected] = useState({
    sku_id: '',
    color: '', 
    size: '',
    currentPrice: 0,
    originalPrice: 0,
    discount: ''
  });
  const [errorFileType, setErrorFileType] = useState("");
  const [reviewPage, setReviewPage] = useState(1);  // Default page 0 (first page)
  const [reviewPerPage, setReviewPerPage] = useState(10);
  const [recentViewPage, setRecentViewPage] = useState(1);  // Default page 0 (first page)
  const [recentViewPerPage, setRecentViewPerPage] = useState(1);
  
  const [similarProductPage, setSimilarProductPage] = useState(1);  // Default page 0 (first page)
  const [similarProductPerPage, setSimilarProductPerPage] = useState(1);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    review: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    review: "",
    rating: "",
  });
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setreviewLoading] = useState(false);
  const [similarProductLoading, setSimilarProductLoading] = useState(false);
  const [recentlyViewLoading, setRecentlyViewLoading] = useState(false);

  const location = useLocation();
  const pathSegments = location.pathname.split("/"); // Split URL by `/`
  const product_id = pathSegments[pathSegments.length - 1];

  useEffect(() => {
    setLoading(true);
    dispatch(getHomeData())
    if(product_id === undefined) {
      return
    } else {
      const responseObj = { 
        product_id: product_id ,
      }
      dispatch(productDetailData(responseObj)).finally(() => {
        setLoading(false); // Set loading to false after fetching data
        setTimeout(() => {
          if (location.state?.scrollToBottom) {
            handleActiveTabs(2);
            window.scrollTo({
              top: 800,
              behavior: "smooth", // For smooth scrolling
            });
          }
        }, 1000);
      });
    }
    
  }, [])

  const tabRefs = [useRef(null), useRef(null), useRef(null)];

  const images = productDetailResponse?.data?.images?.length
  ? productDetailResponse?.data?.images.map((item) => ({
    original: item || '/images/no-product-available.png',
    thumbnail: item || '/images/no-product-available.png',
  }))
  : [{ original: '/images/no-product-available.png', thumbnail: '/images/no-product-available.png' }];

  const handleIncrease = () => {
    if(user.length === 0) {
      setUserLoggedOnCart("Please login to add items to cart.")
      setTimeout(() => {
        setUserLoggedOnCart("")
      }, 1000);
      return;
    }
    const responseObj = {
      sku_id: productDetailResponse?.data?.variants[0]?.sku_id,
      type: 'increase'
    }
    dispatch(addToCartData(responseObj)).finally(() => {
      dispatch(viewItemsInCartData());
      const responseObj = { 
        product_id: product_id ,
      }
      dispatch(productDetailData(responseObj))
      dispatch(setViewCartItems(null));
    })
  };

  const handleDecrease = () => {
    if(user.length === 0) {
      setUserLoggedOnCart("Please login to add items to cart.")
      setTimeout(() => {
        setUserLoggedOnCart("")
      }, 1000);
      return;
    }
    const responseObj = {
      sku_id: productDetailResponse?.data?.variants[0]?.sku_id,
      type: 'decrease'
    }
    dispatch(addToCartData(responseObj)).finally(() => {
      dispatch(viewItemsInCartData());
      const responseObj = { 
        product_id: product_id ,
      }
      dispatch(productDetailData(responseObj))
      dispatch(setViewCartItems(null));
    })
  };

  useEffect(() => {
    const scrollToTab = () => {
      if (window.innerWidth <= 768) {
        // Mobile screen width threshold
        tabRefs[activeTab].current.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToTab();
  }, [activeTab]);

  function capitalizeFirstLetter(string) {
    return string.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Handle input changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error message when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
      isValid = false;
    }

    if (!formData.review.trim()) {
      newErrors.review = "Review is required.";
      isValid = false;
    }

    if(rating === "" || rating === 0) {
      newErrors.rating = "Rating is required"
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Review form submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const uploadedImages = imageData
      .filter((data) => data.imageId !== "") // Exclude empty slots
      .map((data) => data.imageId); // Extract the file objects
    
    if (validate()) {
      const responseObj = {
        product_id: productDetailResponse?.data?.product_id ,
        name: formData.fullName,
        email: formData.email,
        ratings: rating,
        review_text: formData.review,
        image_id: uploadedImages,
      }
      dispatch(addReviewProductData(responseObj))

       const searchParams = new URLSearchParams(location.search); 
       const pageParam = parseInt(searchParams.get("page"), 10) || 1;
       const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || reviewPerPage;
 
       setReviewPage(pageParam - 1); // Adjust for 0-based indexing
       setReviewPerPage(itemsPerPageParam);
 
       const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
       const limit = itemsPerPageParam;
      const reponseReviewObj = {
        product_id: productDetailResponse?.data?.product_id || product_id,
        offset,
        limit
      }
      dispatch(getReviewProductData(reponseReviewObj))
      setFormData({
        fullName: "",
        email: "",
        review: "",
      });
      setRating(0);
      setImageData([
        { imageId: '', imageUrl: '', preview: ''  },
        { imageId: '', imageUrl: '', preview: ''  },
        { imageId: '', imageUrl: '', preview: ''  },
        { imageId: '', imageUrl: '', preview: ''  },
        { imageId: '', imageUrl: '', preview: ''  },
      ]);
      setShowReviewForm(false);
    }
  };

  const toggleReviewForm = () => {
    if(user.length === 0) {
      setUserLoggedOnReview("Please login to add review.")
      return;
    }
    setShowReviewForm(!showReviewForm);
    setUserLoggedOnReview("");
  };

  // handle item on cart
  // const handleAddToCart = () => {
  //   if(user.length === 0) {
  //     setUserLoggedOnCart("Please login to add items to cart.")
  //     return;
  //   }
  //   if (selected.color_code === null) {
  //     setSizeError("Please select a size.");
  //     return;
  //   }
   
  //   const responseObj = {
  //     sku_id: productDetailResponse?.data?.variants[0]?.sku_id,
  //     type: 'increase',
  //   }
  //   dispatch(addToCartData(responseObj)).finally(() =>{
  //     if (addToCartStatusCount === 200) { // Assuming `status` in payload indicates success
  //       // setHandleCartOnLoad(1);
  //       setHandleCartButtonOnLoad(1);
  //     } else {
  //       // setHandleCartOnLoad(0);
  //       setHandleCartButtonOnLoad(0);
  //     }
  //   })
   
  //   setUserLoggedOnCart("")
  // };

  // Add Item on cart and redirection to cart page on But Now button click
  const handleBuyNowProduct = () => {
    if(user.length === 0) {
      setUserLoggedOnBuyNow("Please login to add items to cart.")
      return;
    }
    const responseObj = {
      sku_id: productDetailResponse?.data.variants[0]?.sku_id,
      type: 'increase'
    }
    dispatch(addToCartData(responseObj)).finally(() => {
      // if (addToCartStatusCount === 200) { // Assuming `status` in payload indicates success
        setUserLoggedOnBuyNow("")
        dispatch(viewItemsInCartData());
        const responseObj = { 
          product_id: product_id ,
        }
        dispatch(productDetailData(responseObj))
        dispatch(setViewCartItems(null));
        navigate("/cart");

      // } else {
      //   return;
      // }
    })
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
    const pageParam = parseInt(searchParams.get("recentViewPage"), 10) || 1;
    const itemsPerPageParam = parseInt(searchParams.get("RecentViewPerPage"), 10) || recentViewPerPage;

    setRecentViewPage(pageParam - 1); // Adjust for 0-based indexing
    setRecentViewPerPage(itemsPerPageParam);

    const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
    const limit = itemsPerPageParam;

    setRecentlyViewLoading(true);
    const responseObj = {
      offset,
      limit
    }
    dispatch(getAllRecentViewData(responseObj)).finally(() => {
      setRecentlyViewLoading(false);
    });
    dispatch(viewItemsInCartData());
    dispatch(setViewCartItems(null));
  };


  // Adding Product on whistlist
  const handleWishlistToggle = (productData) => {
    if(user.length === 0) {
      setUserLoggedOnWishList("Please login to add items to wishlist.")
      return;
    }

    const responseObj = { sku_id: Number(productData.variants[0].sku_id) }
    if(productData?.wishlist_status?.toLowerCase() === 'no') {
      dispatch(addProductOnWhistList(responseObj)).finally(() => {
        const responseObj = { 
          product_id: product_id ,
        }
        dispatch(productDetailData(responseObj))
      })
    } else {
        dispatch(deleteSingleWhistListData(responseObj)).finally(() => {
          const responseObj = { 
            product_id: product_id ,
          }
          dispatch(productDetailData(responseObj))
        })
    }
    setUserLoggedOnWishList("")
  };

  // select size and color of product
  useEffect(() => {
    if (productDetailResponse?.data?.variants && productDetailResponse?.data?.variants.length > 0) {
      // Filter unique color_code entries
      const uniqueVariants = Array.from(
        new Map(
          productDetailResponse?.data?.variants.map((item) => [item.color, item]) // Map key is `color_code`
        ).values()
      )
      .sort((a, b) => b.quantity - a.quantity);
      // Automatically select the first item
      const firstItem = uniqueVariants[0];
      
      setSelected({
        sku_id: firstItem.sku_id,
        color: firstItem.color,
        size: firstItem.size,
        currentPrice: firstItem.sku_price?.current,
        originalPrice: firstItem.sku_price?.original,
        discount: firstItem.sku_price?.discount_percentage,
      });
    }
  }, [productDetailResponse]); 
  
  const handleColorClick = (item) => {
    setSelected({ 
      sku_id: item?.sku_id,
      color: item?.color, 
      size: item?.size, 
      currentPrice: item?.sku_price?.current,
      discount: item?.sku_price?.discount_percentage,
      originalPrice: item?.sku_price?.original,
    });
  };
  
   // Function to handle image upload and preview
   const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const responseObj = {
        product_id,
        images: file,
      };
  
      // Dispatch the API call to upload the image
      dispatch(addReviewProductImageData(responseObj))
      .then(() => {
        // After API call, update the specific index in the imageData array
          const updatedImage = getReviewImage;
          // const { imageId, imageUrl } = getReviewImage || {};
          if (updatedImage?.imageId && updatedImage?.imageUrl) {
            setImageData((prev) => {
              const updatedImageData = [...prev];
              updatedImageData[index] = {
                imageId: updatedImage.imageId,
                imageUrl: updatedImage.imageUrl,
                preview: updatedImage.imageUrl, // Update preview with the uploaded image
              };
              return updatedImageData;
            });
          } else {
            console.error("Image upload response not found in state.");
          }
      });
    } else {
      setErrorFileType("Please upload a valid image file");
    }
  };  

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleActiveTabs = (value) => {
    if(activeTab == 2) {
      const searchParams = new URLSearchParams(location.search); 
      const pageParam = parseInt(searchParams.get("page"), 10) || 1;
      const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || reviewPerPage;

      setReviewPage(pageParam - 1); // Adjust for 0-based indexing
      setReviewPerPage(itemsPerPageParam);

      const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
      const limit = itemsPerPageParam;
      const repoonseReviewObj = {
        product_id: productDetailResponse?.data?.product_id,
        offset,
        limit, 
      }
      dispatch(getReviewProductData(repoonseReviewObj))
    }
    setActiveTab(value); 
  }
  
   // pagination with API call for Review Items
   useEffect(() => {
       const searchParams = new URLSearchParams(location.search); 
       const pageParam = parseInt(searchParams.get("page"), 10) || 1;
       const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || reviewPerPage;
 
       setReviewPage(pageParam - 1); // Adjust for 0-based indexing
       setReviewPerPage(itemsPerPageParam);
 
       const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
       const limit = itemsPerPageParam;
 
       setreviewLoading(true);
       const reponseReviewObj = {
        product_id: productDetailResponse?.data?.product_id || product_id,
        offset,
        limit,
      }
      dispatch(getReviewProductData(reponseReviewObj)).finally(() => {
        setreviewLoading(false);
       });
   }, [location.search, reviewPerPage, dispatch]);  // Trigger this effect when the URL's query or page changes
  
   // Handle dropdown change for Review itemsPerPage
  const handleReviewPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setReviewPerPage(newItemsPerPage);
    setReviewPage(0); // Reset to the first page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", 1);
    searchParams.set("itemsPerPage", newItemsPerPage);
    navigate(`?${searchParams.toString()}`);
  };
  
  // Handle page change for Review pagination
  const handleReviewPageChange = (data) => {
    const { selected } = data; // `react-paginate` provides 0-based page index
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", selected + 1); // Convert to 1-based indexing
    navigate(`?${searchParams.toString()}`); // Update URL
  };

  // Dropdown options for Review itemsPerPage
  const reviewItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= getReviewCount);

  const handleProductClick = (product) => {
      const responseObj = { product_id: product.product_id };
      dispatch(productDetailData(responseObj));
      navigate(`/product/${product.product_id}`, { state: { product } });
  };

  // pagination with API call for recently viewed Items
  const searchParams = new URLSearchParams(location.search); 
  useEffect(() => {
      const pageParam = parseInt(searchParams.get("recentViewPage"), 10) || 1;
      const itemsPerPageParam = parseInt(searchParams.get("RecentViewPerPage"), 10) || recentViewPerPage;

      setRecentViewPage(pageParam - 1); // Adjust for 0-based indexing
      setRecentViewPerPage(itemsPerPageParam);

      const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
      const limit = itemsPerPageParam;

      setRecentlyViewLoading(true);
      const responseObj = {
        offset,
        limit
      }
      dispatch(getAllRecentViewData(responseObj)).finally(() => {
        setRecentlyViewLoading(false);
      });
  }, [
    searchParams.get("recentViewPage"), 
    searchParams.get("RecentViewPerPage"),
    dispatch]);  // Trigger this effect when the URL's query or page changes

  // Handle page change event (when user clicks next/previous)
  const handleRecentViewPageChange = (data) => {
    const { selected } = data;
    searchParams.set("recentViewPage", selected + 1); // Convert to 1-based indexing
    navigate(`?${searchParams.toString()}`);
  };

  // Handle dropdown change for itemsPerPage
  const handleRecentViewItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    searchParams.set("recentViewPage", 1);
    searchParams.set("RecentViewPerPage", newItemsPerPage);
    navigate(`?${searchParams.toString()}`);
  };

  // Calculate total pages based on total results
  const recentViewItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= totalRecentView);

  // pagination with API call for Similar product Items
  const similarProductParams = new URLSearchParams(location.search); 
  useEffect(() => {
      if(product_id === undefined) {
        return
      }
      const pageParam = parseInt(similarProductParams.get("SimilarViewPage"), 10) || 1;
      const itemsPerPageParam = parseInt(similarProductParams.get("SimilarViewPerPage"), 10) || similarProductPerPage;

      setSimilarProductPage(pageParam - 1); // Adjust for 0-based indexing
      setSimilarProductPerPage(itemsPerPageParam);

      const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
      const limit = itemsPerPageParam;

      setSimilarProductLoading(true);
      const similarProductPayload = {
        product_id: product_id,
        offset,
        limit
      }
      dispatch(similarProductData(similarProductPayload)).finally(() => {
        setSimilarProductLoading(false);
        const responseObj = { 
          product_id: product_id ,
        }
        dispatch(productDetailData(responseObj))
      });
  }, [
    similarProductParams.get("SimilarViewPage"), 
    similarProductParams.get("SimilarViewPerPage"), 
    product_id, 
    dispatch]);  // Trigger this effect when the URL's query or page changes

  // Handle page change event (when user clicks next/previous)
  const handleSimilarViewPageChange = (data) => {
    const { selected } = data;
    similarProductParams.set("SimilarViewPage", selected + 1); // Convert to 1-based indexing
    navigate(`?${similarProductParams.toString()}`);
  };

  // Handle dropdown change for itemsPerPage
  const handleSimilarViewItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    similarProductParams.set("SimilarViewPage", 1);
    similarProductParams.set("SimilarViewPerPage", newItemsPerPage);
    navigate(`?${similarProductParams.toString()}`);
  };

  // Calculate total pages based on total results
  const similarViewItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= similarProductCount);
  const handleAddToSimilarCartClick = (sku_id) => {
    setTriggerSkuId(sku_id);
    const responseObj = {
      sku_id,
      type: "increase",
    };
    dispatch(addToCartData(responseObj)).finally(() => {
      fetchUpdatedSimilarProductList();
    })
};
const handleSimilarIncrement = (sku_id) => {
  const responseObj = { sku_id, type: "increase" };
  dispatch(addToCartData(responseObj)).finally(() => {
    fetchUpdatedSimilarProductList();
  });
};

const handleSimilarDecrement = (sku_id) => {
  const responseObj = { sku_id, type: "decrease" };
  dispatch(addToCartData(responseObj)).finally(() => {
    fetchUpdatedSimilarProductList();
  });
};

const fetchUpdatedSimilarProductList = () => {
  const pageParam = parseInt(similarProductParams.get("SimilarViewPage"), 10) || 1;
  const itemsPerPageParam = parseInt(similarProductParams.get("SimilarViewPerPage"), 10) || similarProductPerPage;

  setSimilarProductPage(pageParam - 1); // Adjust for 0-based indexing
  setSimilarProductPerPage(itemsPerPageParam);

  const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
  const limit = itemsPerPageParam;

  setSimilarProductLoading(true);
  const similarProductPayload = {
    product_id: product_id,
    offset,
    limit
  }
  dispatch(similarProductData(similarProductPayload)).finally(() => {
    setSimilarProductLoading(false);
    const responseObj = { 
      product_id: product_id ,
    }
    dispatch(productDetailData(responseObj))
  });
  dispatch(viewItemsInCartData());
  dispatch(setViewCartItems(null));
}
  return (
      <div>
        {loading ? (
          <div className="loadingContainer">
            <CircularProgress />
          </div>
          ) : (product_id === "undefined") || (productDetailResponse === null) ? (
            <p className="prdDetailNotFound">No Product found</p>
          ) : (
          <div className="prdDetail">
            <ProductSlider title={false} tile={10} />
            {/* <div className="listPageCategoryItems">
              <CategorySlider />
            </div> */}
            <div className="productDetailInfo">
              <div className="leftDetailInfo">
                <ImageGallery items={images} />
              </div>
              <div className="rightDetailInfo">
                <div className="leftBar">
                  <div className="bestOption">
                    {productDetailResponse?.data?.seller?.ratings && 
                    !isNaN(parseFloat(productDetailResponse?.data?.seller.ratings)) && (
                        <div className="ribbon">
                          {parseFloat(productDetailResponse?.data?.seller.ratings) >= 4.5
                            ? '#Best Seller'
                            : `Seller rating: ${productDetailResponse?.data?.seller.ratings}`
                          }
                        </div>
                      )}
                    <div className="whislistBox">
                      <div
                        onClick={() => handleWishlistToggle(productDetailResponse?.data)}
                        className="wishlist-btn"
                      >
                        {productDetailResponse?.data?.wishlist_status?.toLowerCase() === 'yes' ? (
                          <img
                            src={whistListBox.whistlistFill}
                            alt="Whistlist Product"
                          />
                        ) : (
                          <img src={whistListBox.whistlist} alt="Whistlist Product" />
                        )}
                      </div>
                      <img src={whistListBox.share} alt="Share Product" onClick={() => ShareProduct(productDetailResponse?.data?.product_id)} />
                    </div>
                  </div>
                  {user.length == 0 && <p className="cartError error">{userLoggedOnWishLists}</p>}
                  <h1>{productDetailResponse?.data?.name}</h1>
                  {productDetailResponse?.data?.ratings && <div className="ratingBox">
                    <span>{productDetailResponse?.data?.ratings?.average}</span>
                    {productDetailResponse?.data?.ratings && <StarRating userrating={productDetailResponse?.data?.ratings?.average} />}
                    <div className="reviews">
                      {productDetailResponse?.data?.ratings?.total_reviews || 0} reviews
                    </div>
                  </div>}
                  <div className="priceSection">
                    <div className="priceList">
                      <p className="discount">£ {Number(selected.currentPrice).toFixed(2)}</p>
                      <p className="original">£ {Number(selected.originalPrice).toFixed(2)}</p>
                    </div>
                    {selected && (
                      <p className="discountLabel"> {selected.discount + " Off"}</p>
                    )}
                  </div>
                  <div className="cartSection">
                    <div className={`cartInputBox`} >
                      <div className="increase" onClick={handleIncrease}>
                        +
                      </div>
                      <input
                        type="number"
                        name="cart"
                        value={productDetailResponse?.data?.variants[0]?.quantity}
                        min="1"
                        disabled
                      />
                      <div className="decrease" onClick={handleDecrease}>
                        -
                      </div>
                    </div>
                    {/* <button
                      type="button"
                      className={`addToCart ${handleCartButtonOnLoad == 0 ? '' : 'disabled'}`}
                      onClick={handleAddToCart}
                    >
                      Add to cart
                    </button> */}
                    {selected.size == '' && <p className="cartError error">{sizeError}</p>}
                    {user.length == 0 && <p className="cartError error">{userLoggedOnCart}</p>}
                  </div>
                  <div className="productColor">
                    Color & Size: <span>{selected?.color} , {selected?.size}</span>
                  </div>
                  <div className="ProductColorBoxes">
                    {productDetailResponse?.data?.variants &&
                      // Filter unique color_code entries
                      Array.from(
                        new Map(
                          productDetailResponse?.data?.variants.map((item) => [item.color, item]) // Map key is `color_code`
                        ).values()
                      )
                      .sort((a, b) => b.quantity - a.quantity)
                      .map((item, index) => (
                        // productDetailResponse?.data?.variants.map((item) => (
                        <div
                          onClick={() => handleColorClick(item)} // Update color on click
                          className={`${selected.color === item.color ? 'selected' : ''}`}
                          key={index}>
                            <img
                              key={item.sku_id}
                              src={item.color_image}
                              alt={item.color}
                              className="colorImage"
                            />
                            <p>{item.size}</p>
                        </div>
                      ))}
                  </div>

                  {/* <div className="gaurnteeMessage">
                    <ul>
                      {gaurnteeMessage?.map((item, index) => (
                        <li key={index}>
                          <img src={item.image} alt={item.name} />
                          <p>{item.name}</p>
                        </li>
                      ))}
                    </ul>
                  </div> */}
                  <div className="detailBtn">
                    <button type="button" onClick={() => handleBuyNowProduct()}>Buy Now</button>
                  </div>
                  {user.length == 0 && <p className="cartError error">{userLoggedOnBuyNow}</p>}
                </div>
                <div className="rightBar">
                  <div className="estimatedDelivery">
                    <h4>Estimated Delivery</h4>
                    <p>{"Delivered in " + productDetailResponse?.data?.estimated_delivery_time}</p>
                    {/* <span>{product.freedelivery}</span> */}
                  </div>
                  <div className="commitment">
                    <h4>FikFis Commitments</h4>
                    <ul>
                      {productDetailResponse?.fikfisCommitment?.map((data, index) => (
                        <li key={index}>{data}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="availableOffers">
                    <h4>Available Offers</h4>
                    {productDetailResponse?.availableOffers?.length > 0 ? (
                      <ul>
                        {productDetailResponse?.availableOffers.map((data, index) => (
                          <li key={index}>{data}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No offers available at the moment.</p>
                    )}
                  </div>
                  <div className="stockItemLeft">
                    Hurry! Only {productDetailResponse?.data?.availability?.stock_count} Items Left In Stock
                  </div>
                </div>
              </div>
            </div>
            <div className="productDetailReview">
              <div className="tabs-container">
                <div className="tabs-buttons">
                  <button
                    className={activeTab === 0 ? "active" : ""}
                    onClick={() => handleActiveTabs(0)}
                  >
                    Product Description
                  </button>
                  <button
                    className={activeTab === 1 ? "active" : ""}
                    onClick={() => handleActiveTabs(1)}
                  >
                    Additional Information
                  </button>
                  <button
                    className={activeTab === 2 ? "active" : ""}
                    onClick={() => handleActiveTabs(2)}
                  >
                    FikFis Verified Reviews
                  </button>
                </div>
                <div className="tabs-content">
                  <div
                    className="tab-content productDescription"
                    ref={tabRefs[0]}
                    style={{ display: activeTab === 0 ? "block" : "none" }}
                  >
                    {productDetailResponse?.data?.description && 
                      productDetailResponse?.data?.description.content.map((item, index) => (
                      <p key={index}>
                        {item}
                      </p>
                    ))}
                    {productDetailResponse?.data?.description && 
                      productDetailResponse?.data?.description.image.map((item, index) => (
                      <img key={index} src={item} alt={'Image_' + index} />
                    ))}
                  </div>
                  <div
                    className="tab-content"
                    ref={tabRefs[1]}
                    style={{ display: activeTab === 1 ? "block" : "none" }}
                  >
                    <div className="additionalInfo">
                      <div className="technical info">
                        <h5>Technical Details</h5>
                        <table>
                          <tbody>
                            {productDetailResponse?.data?.additional_info?.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td>
                                    {capitalizeFirstLetter(item?.title.replace(/_/g, " "))}
                                  </td>
                                  <td>{item.value}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-content"
                    ref={tabRefs[2]}
                    style={{ display: activeTab === 2 ? "block" : "none" }}
                  >
                    <div className="reviewSection">
                      <div className="leftReviewPart">
                        <h4>Customer reviews</h4>
                        {productDetailResponse?.data?.ratings && <StarRating userrating={productDetailResponse?.data?.ratings?.average} />}
                          <div className="detailLinearRivewProgress">
                            <div className="reviewProgress">
                              <span>{'5 star'}</span>
                              <div className="progressBar">
                                <LinearProgressWithLabel
                                  value={parseFloat(productDetailResponse?.data?.ratings?.review_count['5Star'])}
                                />
                              </div>
                            </div>
                            <div className="reviewProgress">
                              <span>{'4 star'}</span>
                              <div className="progressBar">
                                <LinearProgressWithLabel
                                  value={parseFloat(productDetailResponse?.data?.ratings?.review_count['4Star'])}
                                />
                              </div>
                            </div>
                            <div className="reviewProgress">
                              <span>{'3 star'}</span>
                              <div className="progressBar">
                                <LinearProgressWithLabel
                                  value={parseFloat(productDetailResponse?.data?.ratings?.review_count['3Star'])}
                                />
                              </div>
                            </div>
                            <div className="reviewProgress">
                              <span>{'2 star'}</span>
                              <div className="progressBar">
                                <LinearProgressWithLabel
                                  value={parseFloat(productDetailResponse?.data?.ratings?.review_count['2Star'])}
                                />
                              </div>
                            </div>
                            <div className="reviewProgress">
                              <span>{'1 star'}</span>
                              <div className="progressBar">
                                <LinearProgressWithLabel
                                  value={parseFloat(productDetailResponse?.data?.ratings?.review_count['1Star'])}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="ratingCalculateInfo">
                            <h4>How are ratings calculated?</h4>
                            <p>
                              To calculate the overall star rating and percentage
                              breakdown by star, we don’t use a simple average. Instead,
                              our system considers things like how recent a review is
                              and if the reviewer bought the item on Amazon. It also
                              analyses reviews to verify trustworthiness.
                            </p>
                          </div>
                        {!showReviewForm && (
                          <div className="productReviewBtn">
                            <button type="button" onClick={toggleReviewForm}>
                              Write Review
                            </button>
                            {user.length == 0 && <p className="cartError error">{userLoggedOnReview}</p>}
                          </div>
                        )}
                      </div>
                      <div className="rightCommentPart">
                        {!showReviewForm && (
                          <>
                            <div className="productReviewList">
                              <h4>Customer say..</h4>
                              {getReview?.length > 0 && <div className='paginationBox'>
                                <div className="itemsPerPageDropdown">
                                    <label>Items per page: </label>
                                    <select value={reviewPerPage} onChange={handleReviewPerPageChange}>
                                        {reviewItemsPerPageOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Pagination component */}
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    pageCount={Math.max(Math.ceil(getReviewCount / reviewPerPage), 1)}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={3}
                                    onPageChange={(ev) => handleReviewPageChange(ev)}
                                    containerClassName={"pagination"}
                                    activeClassName={"active"}
                                    forcePage={reviewPage}  // Sync current page with URL
                                    disabled={getReviewCount === 0} 
                                />
                                </div>
                              }
                              <div className="reviewHeight">
                                {getReview?.map((item, index) => (
                                  <div className="reviewComments" key={index}>
                                    <div className="userImage">
                                      <img
                                        src={item.profile_image}
                                        alt={item.rate_name}
                                      />
                                    </div>
                                    <div className="reviewRightomments">
                                      <div className="userName">{item.name}</div>
                                      <div className="ratingBox">
                                        {item?.rating && (
                                          <StarRating userrating={item.rating} />
                                        )}
                                        <div className="rateusername">
                                          {item.review_text}
                                        </div>
                                      </div>
                                      {item.description && <p>{item.description}</p>}
                                      <div className="reviewed_image">
                                        {item?.images &&
                                          item?.images.map(
                                            (review_image, index) => (
                                              <img
                                                key={index}
                                                src={review_image}
                                                alt={"Product Image"}
                                              />
                                            )
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {!getReview && <p>Reviews not found.</p>}
                              </div>
                            </div>
                          </>
                        )}
                        {showReviewForm && (
                          <div className="product_review_form">
                            <h4>Customer say</h4>
                            <form onSubmit={handleReviewSubmit}>
                              <div className="box">
                                <div className="form-control">
                                  <label for="fullname">Full Name(First and Last name)</label>
                                  <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleReviewChange}
                                  />
                                  {errors.fullName && (
                                    <p className="error">{errors.fullName}</p>
                                  )}
                                </div>
                                <div className="form-control">
                                <label for="email">Email</label>
                                  <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleReviewChange}
                                  />
                                  {errors.email && (
                                    <p className="error">{errors.email}</p>
                                  )}
                                </div>
                              </div>
                              <div className="box full">
                                <div className="form-control">
                                  <label for="review">Write your review</label>
                                  <textarea
                                    cols="10"
                                    name="review"
                                    placeholder="Write Your Review"
                                    value={formData.review}
                                    onChange={handleReviewChange}
                                  ></textarea>
                                  {errors.review && (
                                    <p className="error">{errors.review}</p>
                                  )}
                                </div>
                              </div>
                              <div className="box full images">
                                {/* <label for="Upload Images">Add Photo</label> */}
                                <div className="form-control select">
                                  {imageData.map((data, index) => (
                                    <div className="selectFileBox" key={index}>
                                      {data.imageUrl ? (
                                        <img src={data.imageUrl} alt={`Preview ${index + 1}`} />
                                      ) : (
                                        <img src="/images/add-file.svg" alt="Select File" />
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, index)}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="box full rating">
                                <label for="ratings">Add Rating</label>
                                <StarRating userrating={rating} onRatingChange={handleRatingChange} />
                                {errors.rating && (
                                  <p className="error">{errors.rating}</p>
                                )}
                              </div>
                              <Button
                                type={"submit"}
                                value={"submit"}
                                varient="explore review"
                                space="sp-10"
                              />
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="productHistory allcategory">
              {recentView && recentView.length > 0 && 
                <div className="baseAlignItems">
                  <h3>Recently Viewed</h3>
                  <div className="paginationBox">
                    <div className="itemsPerPageDropdown">
                        <label>Items per page: </label>
                        <select value={recentViewPerPage} onChange={handleRecentViewItemsPerPageChange}>
                            {recentViewItemsPerPageOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={Math.max(Math.ceil(totalRecentView / recentViewPerPage), 1)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handleRecentViewPageChange}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={recentViewPage}
                        disabled={totalRecentView === 0}
                    />
                  </div>
                </div>
              }
                {recentlyViewLoading ? (
                  <div className="loadingContainer">
                    <CircularProgress />
                  </div>
                  ):(
                  <div className="productList">
                    {recentView && recentView.length > 0 && (
                        recentView.map((item, index) => (
                          <div key={index}>
                            <ProductListCard
                              id={item.product_id}
                              image={item.imageUrl || "/images/no-product-available.png"}
                              name={item.name || ""}
                              userrating={item.rating || "0.0"}
                              discountPrice={item.discount || ""}
                              originalPrice={item.price || ""}
                              save={item.save || ""}
                              coupenCode={item.coupen || ""}
                              deliveryTime={item.deliverytime || ""}
                              freeDelivery={item.freedelivery || ""}
                              bestSeller={item.bestseller || ""}
                              time={item.time || ""}
                              discountLabel={item.Offerprice || ""}
                              wishlistStatus={item.wishlistStatus || ''}
                              sku_id={item.sku_id} // Pass SKU ID for Add to Cart
                              onAddToCart={() => handleAddToCartClick(item.sku_id)}
                              cartQuantity={Number(item.cartQuantity)}
                              onIncrement={handleIncrement}
                              onDecrement={handleDecrement}
                              onProductClick={() => handleProductClick(item)}
                            />
                          </div>
                        ))
                      )}
                  </div>
                )}
            </div>
            <div className="productHistory allcategory">
              {productDetailResponse?.data?.similar_products && 
                productDetailResponse?.data?.similar_products.length > 0 &&  
                <div className="baseAlignItems">
                  <h3>Frequently bought</h3>
                  <div className="paginationBox">
                      <div className="itemsPerPageDropdown">
                          <label>Items per page: </label>
                          <select value={similarProductPerPage} onChange={handleSimilarViewItemsPerPageChange}>
                              {similarViewItemsPerPageOptions.map(option => (
                                  <option key={option} value={option}>
                                      {option}
                                  </option>
                              ))}
                          </select>
                      </div>
                      <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          pageCount={Math.max(Math.ceil(similarProductCount / similarProductPerPage), 1)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={handleSimilarViewPageChange}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                          forcePage={similarProductPage}
                          disabled={similarProductCount === 0}
                      />
                  </div>
                </div>
              }
              {similarProductLoading ? (
                <div className="loadingContainer">
                  <CircularProgress />
                </div>
                ): (
                    <div className="productList">
                      {similarProductListResponse && similarProductListResponse.length > 0 && (
                        similarProductListResponse.map((item, index) => (
                          <div key={index}>
                            <ProductListCard
                              id={item.product_id}
                              image={item.imageUrl || "/images/no-product-available.png"}
                              name={item.name || ""}
                              userrating={item.rating || "0.0"}
                              discountPrice={item.discount || ""}
                              originalPrice={item.price || ""}
                              save={item.save || ""}
                              coupenCode={item.coupen || ""}
                              deliveryTime={item.deliverytime || ""}
                              freeDelivery={item.freedelivery || ""}
                              bestSeller={item.bestseller || ""}
                              time={item.time || ""}
                              discountLabel={item.Offerprice || ""}
                              wishlistStatus={item.wishlistStatus || ''}
                              sku_id={item.sku_id} // Pass SKU ID for Add to Cart
                              onAddToCart={() => handleAddToSimilarCartClick(item.sku_id)}
                              cartQuantity={Number(item.cart_quantity)}
                              onIncrement={handleSimilarIncrement}
                              onDecrement={handleSimilarDecrement}
                              onProductClick={() => handleProductClick(item)}
                            />
                          </div>
                        ))
                      )}
                    </div>
              )}
            </div>
          </div>
        )}
      </div>
  );
};

export default ProductDetail;
