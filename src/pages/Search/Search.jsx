import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductListCard from '../../components/ProductListCard/ProductListCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { addToCartData, searchProductData, viewItemsInCartData } from '../../store/slice/api_integration';
import ReactPaginate from 'react-paginate';
import { DEFAULT_OPTIONS } from '../../utils/Constants';
import './Search.css';
import { setViewCartItems } from '../../store/slice/cartSlice';
import { CircularProgress } from '@mui/material';

const Search = () => {
    const { search, total = 0 } = useSelector(state => state.product);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [page, setPage] = useState(0);  // Default page 0 (first page)
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [triggerSkuId, setTriggerSkuId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle product card click
    const handleProductClick = (item) => {
        navigate(`/product/${item.product_id}`, { state: { product: item } });
    };
    
    // Generate dropdown options based on total results
    const itemsPerPageOptions = DEFAULT_OPTIONS
                                    .filter(option => option <= total);     

    useEffect(() => {
        setLoading(true);
        // Read query and page number from the URL search params
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');
        const pageParam = parseInt(searchParams.get('page'), 10) || 1; // Default to page 1 if not provided

        // Update local page state to match the page in the URL
        setPage(pageParam - 1); // `react-paginate` uses 0-based indexing

        // If there is a query, fetch data from API
        if (query) {
            const offset = (pageParam - 1) * itemsPerPage; // Calculate the correct offset
            const responseObj = {
                keyword: query,
                offset,
                limit: itemsPerPage,
            };
            dispatch(searchProductData(responseObj)).finally(() => {
                setLoading(false);
            }); // Dispatch API call
        }
    }, [location.search, itemsPerPage, dispatch]);  // Trigger this effect when the URL's query or page changes
    
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setPage(0); // Reset to the first page
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', 1);
        navigate(`/search?${searchParams.toString()}`);
    };

    // Handle page change event (when user clicks next/previous)
    const handlePageChange = (data) => {
        const { selected } = data;
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', selected + 1); // `react-paginate` uses 0-based index, we set to 1-based index in URL
        navigate(`/search?${searchParams.toString()}`); // Update the URL with the new page
    };

    // Calculate total pages based on total results
    const totalPages = Math.max(Math.ceil(total / itemsPerPage), 1);
    const validPage = Math.min(page, totalPages - 1);

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
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');
        const pageParam = parseInt(searchParams.get('page'), 10) || 1; // Default to page 1 if not provided

        // Update local page state to match the page in the URL
        setPage(pageParam - 1); // `react-paginate` uses 0-based indexing

        // If there is a query, fetch data from API
        if (query) {
            const offset = (pageParam - 1) * itemsPerPage; // Calculate the correct offset
            const responseObj = {
                keyword: query,
                offset,
                limit: itemsPerPage,
            };
            dispatch(searchProductData(responseObj)).finally(() => {
                setLoading(false);
            })
        }
            dispatch(viewItemsInCartData());
            dispatch(setViewCartItems(null));
    };

    return (
        <>
            {loading ? (
                <div className="loadingContainer">
                    <CircularProgress />
                </div>
            ) : (
                <div className='searchProduct'>
                    <div className='searchedItemsHeader'>
                        <h2>Your Searched Items</h2>
                        <div className='paginationBox'>
                            <div className="itemsPerPageDropdown">
                                <label>Items per page: </label>
                                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                    {itemsPerPageOptions.map(option => (
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
                                pageCount={totalPages}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={(ev) => handlePageChange(ev)}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                forcePage={validPage}  // Sync current page with URL
                                disabled={total === 0} 
                            />
                        </div>
                    </div>
                    <div className="productList">
                        {search && search.length > 0 ? (
                            search.map((item, index) => (
                                <div key={index}>
                                    <ProductListCard
                                        id={item.id}
                                        image={item.imageUrl || "/images/no-product-available.png"}
                                        name={item.name || ""}
                                        userrating={item.rating || "0.0"}
                                        discountPrice={item.discountedPrice || ""}
                                        originalPrice={item.price || ""}
                                        save={item.save || ""}
                                        coupenCode={item.coupen || ""}
                                        deliveryTime={item.deliverytime || ""}
                                        freeDelivery={item.freedelivery || ""}
                                        bestSeller={item.bestseller || ""}
                                        time={item.time || ""}
                                        discountLabel={item.discountlabel || ""}
                                        wishlistStatus={item.wishlistStatus || 'no'}
                                        sku_id={item.sku_id} // Pass SKU ID for Add to Cart
                                        // onAddToCart={() => handleAddToCartClick(item.sku_id)}
                                        onAddToCart={() => handleProductClick(item)}
                                        cartQuantity={Number(item.cartQuantity)}
                                        onIncrement={handleIncrement}
                                        onDecrement={handleDecrement}
                                        onProductClick={() => handleProductClick(item)}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="noProductAvailable">No product available</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Search;
