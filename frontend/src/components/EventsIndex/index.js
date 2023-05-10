import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsThunk } from "../../store/events";
import "../GroupsIndex/GroupsIndex.css";
import { Link } from "react-router-dom";
import EventsIndexItem from "../EventsIndexItem";

function EventsIndex() {
    const eventsObj = useSelector(state => state.events.allEvents);
    const events = Object.values(eventsObj);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEventsThunk())
    }, [dispatch])

    if (!events) return null;
    if(!eventsObj) return null;

    console.log("THIS IS EVENTSOBJ: ", eventsObj)
    console.log("THIS IS EVENTS: ", events)

    return (
        <div className="groups-wrapper">
        <nav className="groups-nav">
            <Link to="/events" className="groups-nav-item active-group-event-tab">Events</Link>
            <Link to="/groups" className="groups-nav-item inactive-group-event-tab">Groups</Link>
        </nav>
        <p className="groups-subheader">Events in ReadUp</p>
        <ul className="groups-index-list-container">
            {events.map((event) => (
                <EventsIndexItem
                    event={event}
                    key={event.id}
                />
            ))}
        </ul>
    </div>
    )
}

export default EventsIndex;
