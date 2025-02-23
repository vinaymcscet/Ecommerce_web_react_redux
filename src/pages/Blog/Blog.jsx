import React, { useEffect, useState } from 'react';
import './Blog.css';
import BlogCard from '../../components/BlogCard/BlogCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlogs } from '../../store/slice/api_integration';
import { CircularProgress } from '@mui/material';
import { Helmet } from "react-helmet-async";

const Blog = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { blogList } = useSelector(state => state.user);
    console.log("blogList", blogList);
    
    useEffect(() => {
        setLoading(true)
        dispatch(getAllBlogs()).finally(() => {
            setLoading(false);
        });
    }, [])
    
  return (
    <div className='Blogs'>
        {/* SEO Meta Tags */}
        <Helmet>
            <title>{'FikFis Blog | Trends, Tips & Shopping Guides'}</title>
            <meta name="description" content={'Stay updated with the latest trends, shopping tips, and lifestyle guides on the FikFis Blog. Explore expert insights, fashion updates, and more!'} />
            <meta name="keywords" content={'FikFis Blog | Trends, Tips & Shopping Guides'} />
        </Helmet>
        {loading ? (
            <div className="loadingContainer">
                <CircularProgress />
            </div>
        ) : (
            <>
                <div className="blogsHeader">
                    <h2>Blogs</h2>
                </div>
                <div className="blogsList">
                    <BlogCard card={blogList} />
                </div>
            </>
        )}
    </div>
  )
}

export default Blog