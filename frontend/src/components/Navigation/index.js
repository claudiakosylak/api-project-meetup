import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import SiteLogo from './SiteLogo';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useState, useRef, useEffect } from 'react';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    };

    useEffect(() => {
      if (!showMenu) return;

      const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };

      document.addEventListener('click', closeMenu);

      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    return (
        <div className="top-bar">
                <SiteLogo />
            <ul className="right-nav-links">
                {/* {!sessionUser ? (

                )} */}
                {sessionUser && (
                    <li className="right-nav-link">
                        <NavLink to="/groups/new" style={{textDecoration: 'none'}} className="start-group-nav">
                        Start a new group

                        </NavLink>
                        </li>
                )}
                {(isLoaded && sessionUser) && (
                    <li>
                        <ProfileButton user={sessionUser} />
                    </li>
                )}
                {!sessionUser && (
                    <>
                    <li className="right-nav-link">
                        <OpenModalMenuItem
                            itemText="Log In"
                            onItemClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                    </li>
                    <li className="right-nav-link">
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                    </li>
                    </>
                )}
            </ul>

        </div>
    );
}

export default Navigation;
