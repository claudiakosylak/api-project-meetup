import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/");
  };

  console.log("SHOW MENU: ", showMenu)

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
    <div className="upper-profile-icon-group">
      <button onClick={openMenu} className="user-button">
        <i className="fas fa-user-circle" />
      </button>
      {showMenu ? (
        <i class="fa-solid fa-angle-up" onClick={openMenu}></i>
      ) :  <i class="fa-solid fa-angle-down" onClick={openMenu}></i>}

    </div>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
          <div className="top-of-dropdown">
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>

          </div>
          <div className="middle-dropdown">
            <Link to="/groups/current" className="dropdown-groups-link">Your groups</Link><br />
            <Link to="/events/current" className="dropdown-groups-link">Your events</Link>
          </div>
          <div className="middle-dropdown">
            <Link to="/groups" className="dropdown-groups-link">Explore groups</Link><br />
            <Link to="/events" className="dropdown-groups-link">Explore events</Link>
          </div>
            <li className="middle-dropdown" id="log-out" onClick={logout}>Log Out
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
