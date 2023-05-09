import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import SiteLogo from './SiteLogo';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className="top-bar">
                <SiteLogo />
            <ul className="right-nav-links">
                {/* {!sessionUser ? (

                )} */}
                {sessionUser && (
                    <li className="right-nav-link">
                        <NavLink to="/groups/new" style={{textDecoration: 'none'}}>
                        Start a new group

                        </NavLink>
                        </li>
                )}
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
