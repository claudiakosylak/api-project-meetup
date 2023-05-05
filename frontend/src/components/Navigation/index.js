import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import SiteLogo from '../SiteLogo';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className="top-bar">
                <SiteLogo />
            <ul className="right-nav-links">
                <li className="right-nav-link">
                    <NavLink exact to="/" style={{textDecoration: 'none'}}>Home</NavLink>
                </li>
                {isLoaded && (
                    <li>
                        <ProfileButton user={sessionUser} />
                    </li>
                )}
            </ul>

        </div>
    );
}

export default Navigation;
