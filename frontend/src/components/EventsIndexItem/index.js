import "../GroupsIndexItem/GroupsIndexItem.css";
import { Link } from "react-router-dom";



const EventsIndexItem = ({ event }) => {
    return (
        <li className="groups-index-item-container">
            <div className="group-image-placeholder"></div>
            <div className="group-index-text-container">
                <h2><Link className="group-list-header" to={`/events/${event.id}`}>{event.name}</Link></h2>
                <p>{event.city}, {event.state}</p>
                <p className="group-index-about">{event.about}</p>
                <div className="under-groups-text-container">
                    {/* <p>{events.length} Events</p>
                    <p>•</p>
                    <p>{group.private ? "Private" : "Public"}</p> */}
                </div>
            </div>
        </li>
    )
}

export default EventsIndexItem;
