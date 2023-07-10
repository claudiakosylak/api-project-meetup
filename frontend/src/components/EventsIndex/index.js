import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsThunk } from "../../store/events";
import "../GroupsIndex/GroupsIndex.css";
import { Link, Redirect } from "react-router-dom";
import EventsIndexItem from "../EventsIndexItem";
import "./EventsIndex.css";
import { useState } from "react";

export const sortEvents = events => {
    const currentDate = new Date();
    const orderedEvents = events.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
    })
    const pastEvents = orderedEvents.filter(event => new Date(event.startDate) < currentDate);
    const upcomingEvents = orderedEvents.filter(event => new Date(event.startDate) > currentDate);
    const finalEvents =  upcomingEvents.concat(pastEvents);
    return finalEvents;
}

function EventsIndex() {
    const [page, setPage] = useState(1);
    const eventsObj = useSelector(state => state.events.allEvents);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEventsThunk(page))
    }, [dispatch, page])

    const events = Object.values(eventsObj);

    let sortedEvents = sortEvents(events);

    return (
        <div className="events-wrapper-wrapper">

            <div className="events-wrapper">
                <nav className="groups-nav">
                    <Link to="/events" className="groups-nav-item active-group-event-tab">Events</Link>
                    <Link to="/groups" className="groups-nav-item inactive-group-event-tab">Groups</Link>
                </nav>
                <p className="groups-subheader">Events in ReadUp</p>
                <ul className="groups-index-list-container">
                    {sortedEvents?.map((event) => (
                        <EventsIndexItem
                            event={event}
                            key={event.id}
                        />
                    ))}
                </ul>
            </div>
            <div className="pagination-wrapper">
                {page > 1 && (
                    <p className="page-toggle" onClick={() => setPage(page -1)}><i class="fa-solid fa-chevron-left"></i> Previous Page</p>
                )}
            <p className="page-counter">Page {page}</p>
            {events.length === 20 && (

            <p className="page-toggle" onClick={() => setPage(page + 1)}>Next Page <i class="fa-solid fa-chevron-right"></i></p>
            )}
            </div>
        </div>
    )
}

export default EventsIndex;
