import React, { useEffect } from 'react';
import './Blog.css';
import BlogCard from '../../components/BlogCard/BlogCard';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlogs } from '../../store/slice/api_integration';

const Blog = () => {
    const dispatch = useDispatch();
    const { blogList } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllBlogs());
    }, [])
    
  return (
    <div className='Blogs'>
        <div className="blogsHeader">
            <h2>Blogs</h2>
        </div>
        <div className="blogsList">
            <BlogCard card={blogList} />
        </div>
    </div>
  )
}

export default Blog