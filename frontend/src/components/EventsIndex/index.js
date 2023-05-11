import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsThunk } from "../../store/events";
import "../GroupsIndex/GroupsIndex.css";
import { Link } from "react-router-dom";
import EventsIndexItem from "../EventsIndexItem";
import "./EventsIndex.css";

// export const compareDates = (a, b) => {
//     return a-b;
// }

// export const sortEvents = events => {
//     return events.sort((a, b) => {
//         // console.log("A START DATE ", Date.now(a.startDate))
//         // console.log("B START DATE ", Date.now(b.startDate))
//         return Date.now(a.startDate) - Date.now(b.startDate);
//     })
// }

function EventsIndex() {
    const eventsObj = useSelector(state => state.events.allEvents);
    const events = Object.values(eventsObj);
    const dispatch = useDispatch();
    let currentTime = new Date();
    currentTime = Date.now(currentTime)
    console.log("UNSORTED EVENTS", events)
    const sortedEvents = events.sort((a, b) => {
        const dateA = Date.now(a.startDate)
        const dateB = Date.now(b.startDate)
        if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }

          // names must be equal
          return 0;
    })
    console.log("SORTED EVENTS: ", sortedEvents)
    console.log("THIS IS EVENTS SORTED? ", events)



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
