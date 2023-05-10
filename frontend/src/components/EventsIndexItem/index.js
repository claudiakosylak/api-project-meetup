import "../GroupsIndexItem/GroupsIndexItem.css";
import { Link } from "react-router-dom";
import "./EventsIndexItem.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEventThunk } from "../../store/events";



const EventsIndexItem = ({ event }) => {


    return (
        <Link to={`/events/${event.id}`} className="events-index-item-container">
            <div className="event-index-top">
                <div className="group-image-placeholder"></div>
                <div className="event-index-text-container">
                    <div className="under-groups-text-container"><p>{event.startDate}</p>
                    </div>
                    <h2 className="group-list-header">{event.name}</h2>
                    <p className="group-index-about">{event.about}</p>
                </div>
            </div>
        </Link >
    )
}

export default EventsIndexItem;
