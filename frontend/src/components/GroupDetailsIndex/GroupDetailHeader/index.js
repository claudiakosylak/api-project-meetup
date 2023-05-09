import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./GroupDetailHeader.css";

const GroupDetailHeader = ({ group, numberEvents, user }) => {


    if (!group.Organizer) return null;

    const joinComingSoon = (e) => {
        return alert("Feature coming soon!")
    }

    return (
        <div className="group-header-component-container">
            <div className="group-left-container">
                <div className="back-groups-link">

                    <p>{"<"}</p><Link to="/groups">Groups</Link>
                </div>
                <div className="group-image-placeholder-details-page"></div>

            </div>
            <div className="group-detail-text-container-details-page">
                <div className="group-detail-text-top">
                    <h1>{group.name}</h1>
                    <p>{group.city}, {group.state}</p>
                    <div className="event-public-container">
                        <p>{`${numberEvents} Events`}</p>
                        <p>•</p>
                        <p>{group.private ? "Private" : "Public"}</p>
                    </div>
                    <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>

                </div>

                {(user && user.id === group.Organizer.id) && (
                    <div className="admin-group-buttons">
                        <button>Create event</button>
                        <Link to={`/groups/${group.id}/edit`}><button>Update</button></Link>

                        <button>Delete</button>
                    </div>
                )}
                {(user && user.id !== group.Organizer.id) && (

                    <button className="join-group-button"
                    onClick={joinComingSoon}
                    >Join this group</button>
                )}

            </div>
        </div>
    )
}


export default GroupDetailHeader;
