import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsThunk } from "../../store/events";
import "../GroupsIndex/GroupsIndex.css";
import { Link } from "react-router-dom";
import EventsIndexItem from "../EventsIndexItem";
import "./EventsIndex.css";

const sortEvents = events => {
    const currentDate = new Date();
    const orderedEvents = events.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
    })
    console.log("CURRENT DATE: ", currentDate)

    const pastEvents = events.filter(event => new Date(event.startDate) < currentDate);
    console.log("PAST EVENTS: ", pastEvents);
    const upcomingEvents = events.filter(event => new Date(event.startDate) > currentDate);
    console.log("UPCOMING EVENTS: ", upcomingEvents)
    const finalEvents =  upcomingEvents.concat(pastEvents);
    console.log("FINAL EVENTS: ", finalEvents)
    return finalEvents;
}

function EventsIndex() {
    const eventsObj = useSelector(state => state.events.allEvents);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEventsThunk())
    }, [dispatch])
    // if (!eventsObj.id) return null;
    console.log("EVENTS OBJ: ", eventsObj)
    const events = Object.values(eventsObj);
    // let currentTime = new Date();
    // const sortedEvents = events.sort((a, b) => {
    //     return new Date(a.startDate) - new Date(b.startDate)
    // })
    console.log("EVENTS", events)
    // const pastEvents = sortedEvents.filter(event => event.startDate < currentTime);
    // const upcomingEvents = sortedEvents.filter(event => event.startDate > currentTime);



    let sortedEvents = sortEvents(events);
    console.log("SORTED EVENTS: ", sortedEvents)

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
        </div>
    )
}

export default EventsIndex;
