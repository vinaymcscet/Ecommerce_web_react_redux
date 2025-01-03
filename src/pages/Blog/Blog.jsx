import React, { useEffect, useState } from 'react';
import './Blog.css';
import BlogCard from '../../components/BlogCard/BlogCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlogs } from '../../store/slice/api_integration';
import { CircularProgress } from '@mui/material';

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
    
  return (
    <div className='Blogs'>
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