import React from 'react';
import { Link } from 'react-router-dom';
import './LoggedOutNavButtons.css';

function LoggedOutNavButtons(){

  return (
    <ul className="logged-out-nav-buttons">
      <li>
        <Link exact to="/" style={{textDecoration: 'none'}}><h1 className="site-logo">ReadUp</h1></Link>
      </li>
    </ul>
  );
}

export default LoggedOutNavButtons;
