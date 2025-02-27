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
    
    useEffect(() => {
        setLoading(true)
        dispatch(getAllBlogs()).finally(() => {
            setLoading(false);
        });
    }, [])
    const currentUrl = window.location.href;
    
  return (
    <div className='Blogs'>
        {/* SEO Meta Tags */}
        <Helmet>
            {blogList && blogList.length > 0 && <title>{blogList[0].blog_title}</title>}
            {blogList && blogList.length > 0 && <meta name="description" content={blogList[0].blog_description.replace(/<\/?[^>]+(>|$)/g, "")} />}
            {blogList && blogList.length > 0 && <meta name="keywords" content={blogList[0].blog_title} />}
            {/* <!-- Open Graph / Facebook --> */}
            {blogList && blogList.length > 0 && <meta property="og:title" content={blogList[0].blog_title} />}
            {blogList && blogList.length > 0 && <meta property="og:description" content={blogList[0].blog_description.replace(/<\/?[^>]+(>|$)/g, "")} />}
            {blogList && blogList.length > 0 && <meta property="og:image" content={blogList[0].blog_image} />}
            {/* <meta property="og:image" content={ '/images/icons/LOGO1.png'} /> */}
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content="article" />
            {/* <!-- Twitter --> */}
            <meta property="twitter:card" content="article" />
            <meta property="twitter:url" content={currentUrl} />
            {blogList && blogList.length > 0 && <meta property="twitter:title" content={blogList[0].blog_title} />}
            {blogList && blogList.length > 0 && <meta property="twitter:description" content={blogList[0].blog_description.replace(/<\/?[^>]+(>|$)/g, "")} />}
            {blogList && blogList.length > 0 && <meta property="twitter:image" content={blogList[0].blog_image} />}
            {/* <meta property="twitter:image" content={ '/images/icons/LOGO1.png'} /> */}
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