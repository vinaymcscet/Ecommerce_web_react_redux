import React from 'react';
import './Button.css';

const Button = ({type, value, varient, space, handleClick}) => {
  return (
    <div>
        <button type={type} className={`${varient} ${space}`} onClick={handleClick}>{value}</button>
    </div>
  )
}

export default Button