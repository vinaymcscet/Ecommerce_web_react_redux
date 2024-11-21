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
import { setSelectedSize, addToCart } from "../../store/slice/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import { setUser } from "../../store/slice/userSlice";
import { addProductOnWhistList, addReviewProductData, addToCartData, getHomeData, getReviewProductData, productDetailData } from "../../store/slice/api_integration";
import CircularProgress from '@mui/material/CircularProgress';
import "./ProductDetail.css";
import { gaurnteeMessage } from "../../utils/CommonUtils";
import { DEFAULT_OPTIONS } from "../../utils/Constants";
import ReactPaginate from "react-paginate";
import { ShareProduct } from "../../utils/ShareProduct";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetailResponse, getReview, getReviewCount = 0 } = useSelector((state) => state.product);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [progress, setProgress] = React.useState(0);
  const [sizeError, setSizeError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [whistListBox, setWhistListBox] = useState({
    whistlist: "/images/product/whistlist.svg",
    whistlistFill: "/images/product/whistlist-fill.svg",
    share: "/images/product/share.svg",
  });
  const [handleCartOnLoad, setHandleCartOnLoad] = useState(0);
  const [handleCartButtonOnLoad, setHandleCartButtonOnLoad] = useState(0);
  const [imageData, setImageData] = useState([
    { preview: "", file: null },
    { preview: "", file: null },
    { preview: "", file: null },
    { preview: "", file: null },
    { preview: "", file: null },
  ]);
  const [selected, setSelected] = useState({
    color: '', 
    size: '',
    currentPrice: 0,
    originalPrice: 0,
    discount: ''
  });
  const [errorFileType, setErrorFileType] = useState("");
  const [reviewPage, setReviewPage] = useState(0);  // Default page 0 (first page)
  const [reviewPerPage, setReviewPerPage] = useState(10);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    review: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    review: "",
  });
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const pathSegments = location.pathname.split("/"); // Split URL by `/`
  const productId = pathSegments[pathSegments.length - 1];

  useEffect(() => {
    setLoading(true);
    dispatch(getHomeData())
    const responseObj = { product_id: productId }
    dispatch(productDetailData(responseObj)).finally(() => {
      setLoading(false); // Set loading to false after fetching data
    });
    console.log("productDetailResponse", productDetailResponse);
  }, [])

  const tabRefs = [useRef(null), useRef(null), useRef(null)];

  const images = productDetailResponse?.data?.images?.length
  ? productDetailResponse?.data?.images.map((item) => ({
    original: item || '/images/no-product-available.png',
    thumbnail: item || '/images/no-product-available.png',
  }))
  : [{ original: '/images/no-product-available.png', thumbnail: '/images/no-product-available.png' }];

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    const responseObj = {
      sku_id: productDetailResponse?.data?.skuId,
      type: 'increase'
    }
    dispatch(addToCartData(responseObj))
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => {
      if(prevQuantity > 1) {
        prevQuantity -= 1
        const responseObj = {
          sku_id: productDetailResponse?.data?.skuId,
          type: 'decrease'
        }
        dispatch(addToCartData(responseObj))
      } else {
        prevQuantity = 1;
      }
    });
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1); // Reset to 1 if invalid input
    }
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

    setErrors(newErrors);
    return isValid;
  };

  // Handle Review form submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const uploadedImages = imageData
      .filter((data) => data.file !== null) // Exclude empty slots
      .map((data) => data.file); // Extract the file objects
    
    if (validate()) {
      console.log("Form Data:", formData);
      console.log("Uploaded Images:", uploadedImages);
      const responseObj = {
        product_id: productDetailResponse?.data?.productId ,
        name: formData.fullName,
        email: formData.email,
        ratings: rating,
        review_text: formData.review,
        images: uploadedImages,
      }
      console.log("responseObj", responseObj);
      dispatch(addReviewProductData(responseObj))
      const repoonseReviewObj = {
        product_id: productDetailResponse?.data?.productId,
        offset: 1,
        limit: 10
      }
      dispatch(getReviewProductData(repoonseReviewObj))
      setFormData({
        fullName: "",
        email: "",
        review: "",
      });
      setImageData([
        { preview: "", file: null },
        { preview: "", file: null },
        { preview: "", file: null },
        { preview: "", file: null },
        { preview: "", file: null },
      ]);
      setShowReviewForm(false);
    }
  };

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  const handleAddToCart = () => {
    setHandleCartOnLoad(1);
    setHandleCartButtonOnLoad(1);
    if (selected.color_code === null) {
      setSizeError("Please select a size.");
      return;
    }
    const responseObj = {
      sku_id: productDetailResponse?.data?.skuId,
      type: 'increase'
    }
    dispatch(addToCartData(responseObj))

    // // Dispatch product details and quantity to Redux
    // const productData = {
    //   ...product,
    //   quantity,
    //   selectedSize: product.sizeList[activeIndex]?.name,
    // };

    // dispatch(addToCart(productData));
    // toast.success("Item added to Cart successfully");
  };

  // Adding Product on whistlist
  const handleWishlistToggle = (productData) => {
    const responseObj = { sku_id: productData.skuId }
    dispatch(addProductOnWhistList(responseObj))
  };

  // select size and color of product
  useEffect(() => {
    if (productDetailResponse?.data?.variants && productDetailResponse?.data?.variants.length > 0) {
      // Filter unique color_code entries
      const uniqueVariants = Array.from(
        new Map(
          productDetailResponse?.data?.variants.map((item) => [item.color_code, item]) // Map key is `color_code`
        ).values()
      );
      // Automatically select the first item
      const firstItem = uniqueVariants[0];
      
      setSelected({
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
      color: item?.color, 
      size: item?.size, 
      currentPrice: item?.sku_price?.current,
      discount: item?.sku_price?.discount_percentage,
      originalPrice: item?.sku_price?.original,
    });
  };

   // Function to handle image upload and preview
   const handleImageUpload = (e, index) => {
    const file = e.target.files[0]; // Get the uploaded file
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImageData((prev) =>
        prev.map((img, i) =>
          i === index
            ? { preview: imageUrl, file } // Update the corresponding index
            : img
        )
      );
    } else {
      setErrorFileType("Please upload a valid image file");
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    console.log("Selected Rating:", newRating);
  };

  const handleActiveTabs = (value) => {
    if(activeTab == 2) {
      console.log("review Tab called");
      const repoonseReviewObj = {
        product_id: productDetailResponse?.data?.productId 
      }
      dispatch(getReviewProductData(repoonseReviewObj))
    }
    setActiveTab(value); 
  }
  // Pagination code for User Review List
  // useEffect(() => {
  //   // Extract parameters from the URL
  //   const searchParams = new URLSearchParams(location.search);
  //   const pageParam = parseInt(searchParams.get("page"), 10) || 1;
  //   const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || reviewPerPage;
  
  //   // Update state with URL parameters
  //   setReviewPage(pageParam - 1); // Sync pagination (0-based indexing)
  //   setReviewPerPage(itemsPerPageParam);
  
  //   // Calculate offset and limit dynamically
  //   const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
  //   const limit = itemsPerPageParam;
  
  //   // Dispatch the API call with updated parameters
  //   const responseObj = {
  //     product_id: productDetailResponse.productId,
  //     offset,
  //     limit
  //   }
  //   dispatch(getReviewProductData(responseObj));
  // }, [location.search, reviewPerPage ,dispatch]);
  
  // Handle dropdown change for itemsPerPage
  const handleReviewPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setReviewPerPage(newItemsPerPage);
    setReviewPage(0); // Reset to the first page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", 1);
    searchParams.set("itemsPerPage", newItemsPerPage);
    navigate(`?${searchParams.toString()}`);
  };
  
  // Handle page change for pagination
  const handleReviewPageChange = (data) => {
    const { selected } = data; // `react-paginate` provides 0-based page index
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", selected + 1); // Convert to 1-based indexing
    navigate(`?${searchParams.toString()}`); // Update URL
  };

  // Dropdown options for itemsPerPage
  const reviewItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= getReviewCount);
  
  return (
      <div>
        {loading ? (
          <div className="loadingContainer">
            <CircularProgress />
          </div>
          ) : (
          <div className="prdDetail">
            <ProductSlider title={false} tile={10} />
            <div className="listPageCategoryItems">
              <CategorySlider />
            </div>
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
                      <img src={whistListBox.share} alt="Share Product" onClick={() => ShareProduct(productDetailResponse?.data?.productId)} />
                    </div>
                  </div>
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
                    <div className={`cartInputBox ${handleCartOnLoad === 0 ? 'disabled' : ''}`} >
                      <div className="increase" onClick={handleIncrease}>
                        +
                      </div>
                      <input
                        type="number"
                        name="cart"
                        value={quantity}
                        onChange={handleChange}
                        min="1"
                      />
                      <div className="decrease" onClick={handleDecrease}>
                        -
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`addToCart ${handleCartButtonOnLoad == 0 ? '' : 'disabled'}`}
                      onClick={handleAddToCart}
                    >
                      Add to cart
                    </button>
                    {selected.size == '' && <p className="cartError error">{sizeError}</p>}
                  </div>
                  <div className="productColor">
                    Color & Size: <span>{selected.color} , {selected.size}</span>
                  </div>
                  <div className="ProductColorBoxes">
                    {productDetailResponse?.data?.variants &&
                      // Filter unique color_code entries
                      Array.from(
                        new Map(
                          productDetailResponse?.data?.variants.map((item) => [item.color_code, item]) // Map key is `color_code`
                        ).values()
                      ).map((item) => (
                        <div
                        onClick={() => handleColorClick(item)} // Update color on click
                        className={`${selected.color === item.color ? 'selected' : ''}`}>
                          <img
                            key={item.skuId}
                            src={item.color_image}
                            alt={item.color}
                            className="colorImage"
                          />
                          <p>{item.size}</p>
                        </div>
                      ))}
                  </div>

                  <div className="gaurnteeMessage">
                    <ul>
                      {gaurnteeMessage?.map((item, index) => (
                        <li key={index}>
                          <img src={item.image} alt={item.name} />
                          <p>{item.name}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="detailBtn">
                    <button type="button">Buy Now</button>
                  </div>
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
                                        {item.rate_name}
                                      </div>
                                    </div>
                                    {item.description && <p>{item.description}</p>}
                                    <div className="reviewed_image">
                                      {item?.product_review_image &&
                                        item?.product_review_image.map(
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
                                      {data.preview ? (
                                        <img src={data.preview} alt={`Preview ${index + 1}`} />
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
              <h3>Frequently bought</h3>
              <div className="productList">
                {productDetailResponse?.data?.similar_products && productDetailResponse?.data?.similar_products.length > 0 ? (
                  productDetailResponse?.data?.similar_products.map((item, index) => (
                    <div key={index}>
                      <ProductListCard
                        id={item.product_id}
                        image={item.image ? item.image : ""}
                        name={item.name ? item.name : ""}
                        userrating={item.rating ? item.rating : ""}
                        discountPrice={item.discount ? item.discount : ""}
                        originalPrice={item.price ? item.price : ""}
                        save={item.save ? item.save : ""}
                        coupenCode={item.coupen ? item.coupen : ""}
                        deliveryTime={item.deliverytime ? item.deliverytime : ""}
                        freeDelivery={item.freedelivery ? item.freedelivery : ""}
                        bestSeller={item.bestseller ? item.bestseller : ""}
                        time={item.time ? item.time : ""}
                        discountLabel={item.Offerprice ? item.Offerprice : ""}
                      />
                    </div>
                  ))
                ) : (
                  <p>No product history available</p>
                )}
              </div>
            </div>
            <div className="productHistory allcategory">
              <h3>Inspired by your browsing history</h3>
              <div className="productList">
              {productDetailResponse?.data?.similar_products && productDetailResponse?.data?.similar_products.length > 0 ? (
                  productDetailResponse?.data?.similar_products.map((item, index) => (
                    <div key={index}>
                      <ProductListCard
                        id={item.product_id}
                        image={item.image ? item.image : ""}
                        name={item.name ? item.name : ""}
                        userrating={item.rating ? item.rating : ""}
                        discountPrice={item.discount ? item.discount : ""}
                        originalPrice={item.price ? item.price : ""}
                        save={item.save ? item.save : ""}
                        coupenCode={item.coupen ? item.coupen : ""}
                        deliveryTime={item.deliverytime ? item.deliverytime : ""}
                        freeDelivery={item.freedelivery ? item.freedelivery : ""}
                        bestSeller={item.bestseller ? item.bestseller : ""}
                        time={item.time ? item.time : ""}
                        discountLabel={item.Offerprice ? item.Offerprice : ""}
                      />
                    </div>
                  ))
                ) : (
                  <p>No product history available</p>
                )}
              </div>
            </div>
            <ToastContainer />
          </div>
        )}
      </div>
  );
};

export default ProductDetail;
