import React from 'react';
import { Link } from 'react-router-dom';
import './SiteLogo.css';

function SiteLogo(){

  return (
    <ul className="logo-list">
      <li>
        <Link exact to="/" style={{textDecoration: 'none'}}><h1 className="site-logo">ReadUp</h1></Link>
      </li>
    </ul>
  );
}

export default SiteLogo;
