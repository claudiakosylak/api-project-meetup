import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsThunk } from "../../store/events";
import "../GroupsIndex/GroupsIndex.css";
import { Link } from "react-router-dom";
import EventsIndexItem from "../EventsIndexItem";
import "./EventsIndex.css";


export const sortEvents = events => {
    return events.sort((a, b) => {
        return Date.now(a.startDate) - Date.now(b.startDate);
    })
}

function EventsIndex() {
    const eventsObj = useSelector(state => state.events.allEvents);
    const events = Object.values(eventsObj);
    const dispatch = useDispatch();
    let currentTime = new Date();
    currentTime = Date.now(currentTime)
    console.log("CURRENT TIME PARSED ", currentTime)

    const sortedEvents = sortEvents(events);


    useEffect(() => {
        dispatch(getEventsThunk())
    }, [dispatch])

    return (
        <div className="events-wrapper-wrapper">

            <div className="events-wrapper">
                <nav className="groups-nav">
                    <Link to="/events" className="groups-nav-item active-group-event-tab">Events</Link>
                    <Link to="/groups" className="groups-nav-item inactive-group-event-tab">Groups</Link>
                </nav>
                <p className="groups-subheader">Events in ReadUp</p>
                <ul className="groups-index-list-container">
                    {sortedEvents.map((event) => (
                        <EventsIndexItem
                            event={event}
                            key={event.id}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default EventsIndex;
