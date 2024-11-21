import React from 'react'
import './BlogCard.css';
import { Link } from 'react-router-dom';
import { FormatDateTime } from '../../utils/FormatDateTime';

const BlogCard = ({ card }) => {
    console.log("card", card);

    return (
        <>
            {
                card?.map((data, index) => (
                    <div className='blogCard' key={index}>
                        <img src={data.blog_image} alt={data.blog_title} />
                        <div className="date">{FormatDateTime(data.created_at)}</div>
                        <h3>{data.blog_title}</h3>
                        <p className='description'>{data.blog_description}</p>
                        <p>Category: <span>{data.parent_category_name}</span></p>
                        <p>Sub-category: <span>{data.sub_category_name}</span></p>
                        <div className='blogFooter'>
                            <p>By <strong>{data.author}</strong></p>
                            <Link to={`/blog/${data.id}`}>Read More <span><img src="/images/blogs/read-more.svg" alt="Read More" /></span></Link>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default BlogCard