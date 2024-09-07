import React from 'react';
import Subscribe from '../Subscribe/Subscribe';
import Copyright from '../Copyright/Copyright';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='footercontainer'>
            <Subscribe />
            <div className='mainFooter'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={3} md={6} className="leftHead">
                            <div className="list">
                                <h4>Company info</h4>
                                <ul>
                                    <li><Link to="/about">About us</Link></li>
                                    <li><Link to="/blog">Blog</Link></li>
                                    <li><Link to="/contact">Contact us</Link></li>
                                </ul>
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={3} md={6} className="leftHead">
                            <div className="list">
                                <h4>Customer service</h4>
                                <ul>
                                    <li><Link to="/faq">FAQ's</Link></li>
                                    <li><Link to="/terms-condition">Term & Condition</Link></li>
                                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                    <li><Link to="/disclaimer">Disclaimer</Link></li>
                                    <li><Link to="/refund-policy">Refund Policy</Link></li>
                                    <li><Link to="/return-and-refund">Return & Refunds</Link></li>
                                    <li><Link to="/shipping-and-delivery">Shipping & Delivery</Link></li>
                                    <li><Link to="/order-cancellation">Order Cancellation</Link></li>
                                </ul>
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={3} md={6} className="leftHead">
                            <div className="list connect">
                                <h4>Connect with FikFis</h4>
                                <ul>
                                    <li><Link href="#"><img src="/images/icons/Youtube.svg" alt='Youtube' /> <span>@fikfis</span></Link></li>
                                    <li><Link to="/"><img src="/images/icons/Twitter.svg" alt='Twitter' /> <span>@fikfis</span></Link></li>
                                    <li><Link to="/"><img src="/images/icons/Instagram.svg" alt='Instagram' /> <span>@fikfis</span></Link></li>
                                    <li><Link to="/"><img src="/images/icons/Facebook.svg" alt='Facebook' /> <span>@fikfis</span></Link></li>
                                </ul>
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={3} md={6} className="leftHead">
                            <div className="list store">
                                <h4>Download the FikFis App</h4>
                                <ul>
                                    <li><Link to="/"><img src="/images/icons/Play-store.svg" alt='Play Store' /> </Link></li>
                                    <li><Link to="/"><img src="/images/icons/Apple-store.svg" alt='Apple Store' /></Link> </li>
                                </ul>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <Copyright />
        </div>
    )
}

export default Footer