import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import { addToCartData, deleteSingleWhistListData, getListOfWhistListData, productDetailData } from '../../store/slice/api_integration';
import StarRating from '../../components/StarRating/StarRating';
import { ShareProduct } from '../../utils/ShareProduct';
import { setListWishList } from '../../store/slice/productSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { CircularProgress } from '@mui/material';
import './Wishlist.css';

const Wishlist = () => { 
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [wishListPage, setWishListPage] = useState(0);  // Default page 0 (first page)
    const [wishListItemsPerPage, setWishListItemsPerPage] = useState(1);
    const { 
        listWishlist, 
        totalWishlistCount = 0, 
    } = useSelector((state) => state.product);    

    // remove wishlist
    const handleRemoveWishListItem = (productId) => {
        const updatedWishlist = listWishlist.filter((item) => item.sku_id !== productId);
        dispatch(setListWishList(updatedWishlist)); 

        const responseObj = { sku_id: productId };
        dispatch(deleteSingleWhistListData(responseObj)).then(() => {
            // Re-fetch the updated wishlist after the deletion
            const offset = (wishListPage * wishListItemsPerPage) + 1;
            const limit = wishListItemsPerPage;
    
            const fetchResponseObj = {
                offset,
                limit
            };
            dispatch(getListOfWhistListData(fetchResponseObj));
        });
    };

    // Add to cart from wishlist page
    const handleAddToCart = (item) => {
        // Dispatch product details and quantity to Redux
        const responseObj = { 
            product_id: item.product_id,
        }
        dispatch(productDetailData(responseObj))
        navigate(`/product/${item.product_id}`, { state: { product: item } });
        // const responseObj = {
        //     sku_id: item?.sku_id,
        //     type: 'increase'
        // }
        // dispatch(addToCartData(responseObj))
    };

    // Pagination Code for WishList Items
    useEffect(() => {
    // Extract parameters from the URL
    setLoading(true)
    const searchParams = new URLSearchParams(location.search);
    const pageParam = parseInt(searchParams.get("wishListPage"), 10) || 1;
    const itemsPerPageParam = parseInt(searchParams.get("wishListItemsPerPage"), 10) || wishListItemsPerPage;
    
    // Update state with URL parameters
    setWishListPage(pageParam - 1); // Sync pagination (0-based indexing)
    setWishListItemsPerPage(itemsPerPageParam);
    
    // Calculate offset and limit dynamically
    const offset = ((pageParam - 1) * itemsPerPageParam) + 1;
    const limit = itemsPerPageParam;
    
    // Dispatch the API call with updated parameters
    const responseObj = {
        offset,
        limit
    }
    dispatch(getListOfWhistListData(responseObj)).finally(() => {
      setLoading(false);
    });
    }, [location.search, dispatch]);
    
    // Handle dropdown change for itemsPerPage
    const handleWishListItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setWishListItemsPerPage(newItemsPerPage);
    setWishListPage(0); // Reset to the first page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("wishListPage", 1);
    searchParams.set("wishListItemsPerPage", newItemsPerPage);
    navigate(`?${searchParams.toString()}`);
    };
    
    // Handle page change for pagination
    const handleWishListPageChange = (data) => {
    const { selected } = data; // `react-paginate` provides 0-based page index
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", selected + 1); // Convert to 1-based indexing
    navigate(`?${searchParams.toString()}`); // Update URL
    };

    // Dropdown options for itemsPerPage
    const wishListItemsPerPageOptions = DEFAULT_OPTIONS.filter(option => option <= totalWishlistCount);  

  return (
    
    <div className="whistlistList">
      <h3>Your Wishlist Waiting...</h3>
          <div className="wishlistContent">
              {listWishlist && (
                  <div className='paginationBox'>
                      <div className="itemsPerPageDropdown">
                          <label>Items per page: </label>
                          <select value={wishListItemsPerPage} onChange={handleWishListItemsPerPageChange}>
                              {wishListItemsPerPageOptions.map(option => (
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
                          breakClassName={"break-me"}
                          pageCount={Math.max(Math.ceil(totalWishlistCount / wishListItemsPerPage), 1)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={(ev) => handleWishListPageChange(ev)}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                          forcePage={wishListPage}
                          disabled={totalWishlistCount === 0} 
                      />
                  </div>
              )}
              {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
                ) : (
                <div className="whistListWrapper">
                    {listWishlist && listWishlist.map((item, index) => (
                        <div key={index} className="whistlistMainWrapper">
                            <div className="whistlistBox">
                                <div className="leftWhistlist">
                                    <img src={item.imageUrl} alt={item.name} />
                                </div>
                                <div className="rightWhistlist">
                                    <h4>
                                        <span>{item.name}</span>
                                        <button className="addToCart" onClick={() => handleAddToCart(item)}>Add to cart</button>
                                    </h4>
                                    {item.rating && <StarRating userrating={item.rating} />}
                                    <div className="priceSection">
                                        <div className="priceList">
                                            <p className="discount">£ {item.discountedPrice}</p>
                                            <p className="original">£ {item.price}</p>
                                        </div>
                                        {item.offer && <p className="discount">£ {item.offer}</p>}
                                    </div>
                                    <div className="cartActionItems">
                                        <div className="icon" onClick={() => ShareProduct(item?.product_id)}>
                                            <img src="/images/icons/share.svg" alt="share Item" />
                                        </div>
                                        <div className="icon" onClick={() => handleRemoveWishListItem(item.sku_id)}>
                                            <img src="/images/icons/delete.svg" alt="delete Item" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {listWishlist === null && <p className="noWishlist">Your wishlist is empty.</p>}
                </div>
              )}
          </div>
    </div>
  )
}

export default Wishlist