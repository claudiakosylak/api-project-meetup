import React from 'react';
import readingClipArt from "./reading-clip-art.jpg";
import "./ReadupIndex.css";
import croppedHand from "./images/cropped-green-hand.png";
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
                    {!sessionUser && (
                <div className="join-readup-button">
                    <OpenModalMenuItem
                        itemText="Join ReadUp"
                        modalComponent={<SignupFormModal />}

                    />
                </div>
                // <button className="join-readup-button">Join ReadUp</button>
            )}
                </div>
                <img src={readingClipArt} alt="Boy reading a book" className="reading-clip-art"
                onError={e => { e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg" }} ></img>
            </div>
            <div className="how-readup-works-wrapper">
                <br></br>
                <br></br>
                <h3 className="how-readup-works-title">How ReadUp works</h3>
                <p id="how-description">Meet new people who share your literary interests through online and in-person events. It’s free to create an account.</p>
            </div>
            <div className="home-bottom-wrapper">
                <div className="home-bottom-section">
                    <img src={croppedHand} alt="high five" className="home-bottom-images"></img>
                    <h4 className="home-bottom-header"><Link to="/groups" className="home-bottom-link">See all groups</Link></h4>
                    <p id="home-bottom-description">Read what you love, meet others who love it, find your community. The rest is history!</p>
                </div>
                <div className="home-bottom-section">
                    <img src={findEventImage} alt="Man and woman with book" className="home-bottom-images"></img>
                    <h4 className="home-bottom-header"><Link to="/events" className="home-bottom-link">Find an event</Link></h4>
                    <p id="home-bottom-description">Events are happening on just about any topic you can think of, from Harry Potter and young adult fiction to self-help and non-fiction.</p>
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
                    <p id="home-bottom-description">You don’t have to be an expert to gather people together and explore shared readinginterests.</p>
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
                <footer className="footer-space">
                                <div className="footer-icons">
                <a href="https://www.linkedin.com/in/claudiakosylak/"><i class="fa-brands fa-linkedin"></i></a>
                <a href="https://github.com/claudiakosylak"><i class="fa-brands fa-github"></i></a>
                </div>
                <p>Developed by Claudia Kosylak</p>
                </footer>
            )}
        </div>
    )
}

export default ReadupIndex;
