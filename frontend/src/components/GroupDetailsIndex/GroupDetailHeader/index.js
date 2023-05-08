import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./GroupDetailHeader.css";

const GroupDetailHeader = ({group}) => {

    console.log("GROUP WITHIN HEADER: ", group)

    return (
        <div className="group-header-component-container">
            <div className="group-left-container">
            <Link to="/groups">Groups</Link>
            <div className="group-image-placeholder-details-page"></div>

            </div>
            <div className="group-detail-text-container-details-page">
                <h1>{group.name}</h1>
                <p>{group.city}, {group.state}</p>
                <div className="event-public-container">
                    <p>## Events</p>
                    <p>{group.private ? "Private" : "Public"}</p>
                </div>
                <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
            </div>
        </div>
    )
}


export default GroupDetailHeader;
