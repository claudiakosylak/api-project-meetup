import React from 'react';
import readingClipArt from "./reading-clip-art.jpg";
import "./ReadupIndex.css";
import seeGroupsImage from "./images/eco-green-high-five.png";
import findEventImage from "./images/man-and-woman.png";
import startGroupImage from "./images/group-of-friends.png";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import SignupFormModal from '../SignupFormModal';


function ReadupIndex() {
    const sessionUser = useSelector(state => state.session.user);
    return (
        <div className="home-wrapper">
            <div className="introduction-wrapper">
                <div className="introduction-text">
                    <h2 className="introduction-headline">
                        The book club platform - <br />Where books become friendships
                    </h2>
                    <p className="introduction-sub-text">
                    Welcome to readUp, the ultimate destination for book lovers and avid readers! Join our vibrant online community and unlock a world of literary connections.
                    </p>
                </div>
                <img src={readingClipArt} alt="Boy reading a book" className="reading-clip-art"></img>
            </div>
            <div className="how-readup-works-wrapper">
                <h3 className="how-readup-works-title">How ReadUp works</h3>
                <p>This is a description of how this site works and how you can use it</p>
            </div>
            <div className="home-bottom-wrapper">
                <div className="home-bottom-section">
                    <img src={seeGroupsImage} alt="high five" className="home-bottom-images"></img>
                    <h4 className="home-bottom-header"><Link to="/groups" className="home-bottom-link">See all groups</Link></h4>
                    <p className="home-bottom-description">This is a description of what will happen if you click here to look</p>
                </div>
                <div className="home-bottom-section">
                    <img src={findEventImage} alt="Man and woman with book" className="home-bottom-images"></img>
                    <h4 className="home-bottom-header"><Link to="/events" className="home-bottom-link">Find an event</Link></h4>
                    <p className="home-bottom-description">This is a description of what will happen if you click here to look</p>
                </div>
                <div className="home-bottom-section">
                    <img src={startGroupImage} alt="Group of friends" className="home-bottom-images"></img>
                    <h4 className="home-bottom-header">
                        {sessionUser ? (
                            <Link to="/groups/new" className="home-bottom-link">Start a new group</Link>
                        ) : (
                            <span className="logged-out-make-group-link">Start a new group</span>
                        )}
                    </h4>
                    <p className="home-bottom-description">This is a description of what will happen if you click here to look</p>
                </div>
            </div>
            {!sessionUser && (
                <div className="join-readup-button">
                    <OpenModalMenuItem
                        itemText="Join ReadUp"
                        modalComponent={<SignupFormModal />}

                    />
                </div>
                // <button className="join-readup-button">Join ReadUp</button>
            )}
            {sessionUser && (
                <div className="footer-space"></div>
            )}
        </div>
    )
}

export default ReadupIndex;
