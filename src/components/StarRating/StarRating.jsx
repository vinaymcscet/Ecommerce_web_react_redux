import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ userrating }) => {
    const [rating, setRating] = useState(userrating ? userrating : 0);
    // const [hover, setHover] = useState(null);
    // const [totalStars, setTotalStars] = useState(5);
    const [totalStars] = useState(5);

    return (
        <div className="starRating">
            {[...Array(totalStars)].map((star, index) => {
                const currentRating = index + 1;
                return (
                    <label key={index}>
                        <input
                            key={star}
                            type="radio"
                            name="rating"
                            value={currentRating}
                            onChange={() => setRating(currentRating)}
                        />
                        <span
                            className="star"
                            style={{
                                color:
                                    // currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9",
                                    currentRating <= rating ? "#ffc107" : "#e4e5e9",
                            }}
                        // onMouseEnter={() => setHover(currentRating)}
                        // onMouseLeave={() => setHover(null)}
                        >
                            &#9733;
                        </span>
                    </label>
                );
            })}
        </div>
    );
}

export default StarRating