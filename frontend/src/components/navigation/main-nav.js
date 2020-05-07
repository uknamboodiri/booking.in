import React from 'react';
import { NavLink } from 'react-router-dom';
import './main-nav.css'

const mainNavigation = prop => (
    <header className="top-nav">
        <div className="top-nav-logo">
            <h1>Booking.in</h1>
        </div>

        <nav className="top-nav-items">
            <ul>
                <li>
                    <NavLink to="/auth" >Authenticate</NavLink>
                </li>
                <li>
                    <NavLink to="/events" >Events</NavLink>
                </li>
                <li>
                    <NavLink to="/bookings" >Bookings</NavLink>
                </li>
            </ul>
        </nav>
    </header>

);

export default mainNavigation;