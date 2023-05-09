import "../GroupsIndexItem/GroupsIndexItem.css";
import { Link } from "react-router-dom";
import "./EventsIndexItem.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEventThunk } from "../../store/events";



const EventsIndexItem = ({ event }) => {
    const eventId = event.id;
    const dispatch = useDispatch();
    const fullEvent = useSelector(state => state.events[eventId])

    useEffect(() => {
        dispatch(getEventThunk(eventId))
    }, [dispatch])
    return (
        <li className="events-index-item-container">
            <div className="event-index-top">
                <div className="group-image-placeholder"></div>
                <div className="event-index-text-container">
                    <div className="under-groups-text-container"><p>{event.startDate}</p>
                    </div>
                    <h2><Link className="group-list-header" to={`/events/${event.id}`}>{event.name}</Link></h2>
                    <p>{event.city}, {event.state}</p>
                    <p className="group-index-about">{event.about}</p>
                </div>
            </div>
            <div className="event-index-bottom">
                {fullEvent.description}
            </div>
        </li>
    )
}

export default EventsIndexItem;
