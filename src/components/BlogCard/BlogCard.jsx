import React from 'react'
import './BlogCard.css';
import { Link } from 'react-router-dom';
import { formatDateTimeProduct } from '../../utils/FormatDateTime';
import { Helmet } from "react-helmet";

const BlogCard = ({ card }) => {

    return (
        <>
            {
                card?.map((data, index) => (
                    <div className='blogCard' key={index}>
                        <Helmet>
                            <title>{'FikFis Blog | Trends, Tips & Shopping Guides'}</title>
                            <meta name="description" content={'Stay updated with the latest trends, shopping tips, and lifestyle guides on the FikFis Blog. Explore expert insights, fashion updates, and more!'} />
                            <meta name="keywords" content={'FikFis Blog | Trends, Tips & Shopping Guides'} />
                        </Helmet>
                        <img src={data.blog_image} alt={data.blog_title} />
                        <div className="date">{formatDateTimeProduct(data.created_at).formattedDate}</div>
                        <h3>{data.blog_title}</h3>
                        <p className='description' dangerouslySetInnerHTML={{__html:data.blog_description}} />
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