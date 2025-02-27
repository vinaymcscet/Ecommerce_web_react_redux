import React from 'react'
import './BlogCard.css';
import { Link } from 'react-router-dom';
import { formatDateTimeProduct } from '../../utils/FormatDateTime';
import { Helmet } from "react-helmet-async";

const BlogCard = ({ card }) => {
    const currentUrl = window.location.href;
    
    return (
        <>
            {
                card?.map((data, index) => (
                    <div className='blogCard' key={index}>
                        <Helmet>
                            <title>{'FikFis Blog | Trends, Tips & Shopping Guides'}</title>
                            <meta name="description" content={'Stay updated with the latest trends, shopping tips, and lifestyle guides on the FikFis Blog. Explore expert insights, fashion updates, and more!'} />
                            {data && data.length > 0 && <meta name="keywords" content={data.blog_title} />}
                            {/* <!-- Open Graph / Facebook --> */}
                            <meta property="og:title" content={'FikFis Blog | Trends, Tips & Shopping Guides'} />
                            <meta property="og:description" content={'Stay updated with the latest trends, shopping tips, and lifestyle guides on the FikFis Blog. Explore expert insights, fashion updates, and more!'} />
                            {data && data.length > 0 && <meta property="og:image" content={data.blog_image} />}
                            {/* <meta property="og:image" content={ '/images/icons/LOGO1.png'} /> */}
                            <meta property="og:url" content={currentUrl} />
                            <meta property="og:type" content="article" />
                            {/* <!-- Twitter --> */}
                            <meta property="twitter:card" content="article" />
                            <meta property="twitter:url" content={currentUrl} />
                            <meta property="twitter:title" content={'FikFis Blog | Trends, Tips & Shopping Guides'} />
                            <meta property="twitter:description" content={'Stay updated with the latest trends, shopping tips, and lifestyle guides on the FikFis Blog. Explore expert insights, fashion updates, and more!'} />
                            {data && data.length > 0 && <meta property="twitter:image" content={data.blog_image} />}
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