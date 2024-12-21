import React, { useState, useEffect } from 'react';
import './Reviews.css';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserReviewProductData } from '../../store/slice/api_integration';
import ReactPaginate from 'react-paginate';
import StarRating from '../../components/StarRating/StarRating';
import { CircularProgress } from '@mui/material';

const Reviews = () => {
    const [reviewPage, setReviewPage] = useState(0);  // Default page 0 (first page)
    const [reviewPerPage, setReviewPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    const { 
        userReviewCount = 0,
        userReview
    } = useSelector((state) => state.product);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // Pagination code for User Review List
    useEffect(() => {
        setLoading(true)
        // Extract parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get("page"), 10) || 1;
        const itemsPerPageParam = parseInt(searchParams.get("itemsPerPage"), 10) || reviewPerPage;
      
        // Update state with URL parameters
        setReviewPage(pageParam - 1); // Sync pagination (0-based indexing)
        setReviewPerPage(itemsPerPageParam);
      
        // Calculate offset and limit dynamically
        const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
        const limit = itemsPerPageParam;
      
        // Dispatch the API call with updated parameters
        const responseObj = {
          offset,
          limit
        }
        dispatch(getUserReviewProductData(responseObj)).finally(() => {
            setLoading(false);
        });
      }, [location.search, reviewPerPage ,dispatch]);
      
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
      const reviewItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= userReviewCount);

  return (
    <div className="reviewedItems">
        <div className="reviewHeader">
            <h3>Item Reviews</h3>
            {userReview && <div className='paginationBox'>
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
                    pageCount={Math.max(Math.ceil(userReviewCount / reviewPerPage), 1)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={(ev) => handleReviewPageChange(ev)}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    forcePage={reviewPage}  // Sync current page with URL
                    disabled={userReviewCount === 0} 
                />
                </div>
            }
        </div>
        {loading ? (
        <div className="loadingContainer">
            <CircularProgress />
        </div>
        ) : (
        <div className="reviewItemList">
            {userReview &&
            userReview.map((item, index) => (
                <div className="reviewProduct" key={index}>
                <div className="item_header">
                    <div className="leftReviewPart">
                    <img src={item.imageUrl} alt={item.product_name} />
                    </div>
                    <div className="rightReviewPart">
                    {item.product_name && <h4>{item.product_name}</h4>}
                    {item.product_id && <p>ORDER # {item.product_id}</p>}
                    {item.rating && (
                        <StarRating userrating={item.rating} />
                    )}
                    </div>
                </div>
                {/* <p>{item.descriptipn}</p> */}
                <div className="reviewd_prd_image">
                    {item.review_images &&
                    item.review_images.map((img_data, index) => (
                        <div className="item" key={index}>
                        <img src={img_data} alt={item.product_name} />
                        </div>
                    ))}
                </div>
                {/* <div className="review_time">{item.date}</div> */}
                </div>
            ))}
            {!userReview && <p className="noReviews">No reviews found.</p>}
        </div>
        )}
    </div>
  )
}

export default Reviews