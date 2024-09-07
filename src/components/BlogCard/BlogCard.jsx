import React from 'react'
import './BlogCard.css';
import { Link } from 'react-router-dom';

const BlogCard = ({ card }) => {
    console.log("card", card);

    return (
        <>
            {
                card.map((data, index) => (
                    <div className='blogCard' key={index}>
                        <img src={data.images} alt='FikFis Blog' />
                        <div className="date">{data.date}</div>
                        <h3>{data.name}</h3>
                        <p>{data.description}</p>
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