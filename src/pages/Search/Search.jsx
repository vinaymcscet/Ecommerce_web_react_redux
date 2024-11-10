import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Search.css';
import ProductListCard from '../../components/ProductListCard/ProductListCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProductData } from '../../store/slice/api_integration';
import ReactPaginate from 'react-paginate';

const ITEMS_PER_PAGE = 5;

const Search = () => {
    const { search, total = 0 } = useSelector(state => state.product);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [page, setPage] = useState(0);  // Default page 0 (first page)

    // Handle product card click
    const handleProductClick = (item) => {
        navigate(`/product/${item.id}`, { state: { product: item } });
    };
    console.log("total", total);
    

    useEffect(() => {
        // Read query and page number from the URL search params
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');
        const pageParam = parseInt(searchParams.get('page'), 10) || 1; // Default to page 1 if not provided

        // Update local page state to match the page in the URL
        setPage(pageParam - 1); // `react-paginate` uses 0-based indexing

        // If there is a query, fetch data from API
        if (query) {
            const offset = (pageParam - 1) * ITEMS_PER_PAGE; // Calculate the correct offset
            const responseObj = {
                keyword: query,
                offset,
                limit: ITEMS_PER_PAGE,
            };
            dispatch(searchProductData(responseObj)); // Dispatch API call
        }
    }, [location.search, dispatch]);  // Trigger this effect when the URL's query or page changes

    // Handle page change event (when user clicks next/previous)
    const handlePageChange = (data) => {
        console.log('Page Changed: ', data);
        const { selected } = data;
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', selected + 1); // `react-paginate` uses 0-based index, we set to 1-based index in URL
        navigate(`/search?${searchParams.toString()}`); // Update the URL with the new page
    };

    // Calculate total pages based on total results
    const totalPages = Math.max(Math.ceil(total / ITEMS_PER_PAGE), 1);
    const validPage = Math.min(page, totalPages - 1);

    return (
        <div className='searchProduct'>
            <h2>Your Searched Items</h2>

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

            {/* Product list */}
            <div className="productList">
                {search && search.length > 0 ? (
                    search.map((item, index) => (
                        <div key={index} onClick={() => handleProductClick(item)}>
                            <ProductListCard
                                id={item.id}
                                image={item.imageUrl || "/images/no-product-available.jpg"}
                                name={item.name || ""}
                                userrating={item.rating || ""}
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
                            />
                        </div>
                    ))
                ) : (
                    <p className="noProductAvailable">No product available</p>
                )}
            </div>
        </div>
    );
}

export default Search;
