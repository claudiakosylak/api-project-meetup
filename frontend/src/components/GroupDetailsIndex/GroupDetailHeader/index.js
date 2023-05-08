import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./GroupDetailHeader.css";

const GroupDetailHeader = ({ group, numberEvents }) => {


    if (!group.Organizer) return null;


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
                    <p>{group.private ? "Private" : "Public"}</p>
                </div>
                <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>

                </div>
                <button className="join-group-button"
                // onClick={alert("Feature Coming Soon...")}
                >Join this group</button>
            </div>
        </div>
    )
}


export default GroupDetailHeader;
