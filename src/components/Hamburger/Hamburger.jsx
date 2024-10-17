import React from 'react';
import './Hamburger.css'

const Hamburger = ({ isOpen }) => {
    return (
        <div className='hamburger'>
            <div className="burger burger1" style={{
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease'
                }}>
            </div>
            <div className="burger burger2" style={{
                    transform: isOpen ? 'translateX(100%)' : 'translateX(0)',
                    opacity: isOpen ? 0 : 1,
                    transition: 'transform 0.3s ease, opacity 0.3s ease'
                }}>
            </div>
            <div className="burger burger3" style={{
                    transform: isOpen ? 'rotate(-45deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease'
                }}>
            </div>
        </div>
    )
}

export default Hamburger