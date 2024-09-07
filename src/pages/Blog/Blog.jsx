import React from 'react';
import './Blog.css';
import BlogCard from '../../components/BlogCard/BlogCard';
import { BlogsList } from '../../utils/BlogsList';

const Blog = () => {
  return (
    <div className='Blogs'>
        <div className="blogsHeader">
            <h2>Blogs</h2>
            <div className="category">
                <select>
                    <option>Select Category</option>
                    <option>Category 1</option>
                    <option>Category 2</option>
                    <option>Category 3</option>
                </select>
            </div>
        </div>
        <div className="blogsList">
            <BlogCard card={BlogsList} />
        </div>
    </div>
  )
}

export default Blog