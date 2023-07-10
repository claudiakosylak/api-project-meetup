import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventsIndexItem from "../EventsIndexItem";
import { sortEvents } from "../EventsIndex";
import { getAttendedEventsThunk } from "../../store/attendances";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function YourEventsIndex() {
    const eventsObj = useSelector(state => state.attendees.attendedEvents);
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAttendedEventsThunk())
    }, [dispatch])

    if (!user) {
        return <Redirect to="/"/>
    }

    const events = Object.values(eventsObj);

    let sortedEvents = sortEvents(events);

    return (
        <div className="events-wrapper-wrapper">

            <div className="events-wrapper">
                <h1 id="your-groups-header">Your Events</h1>
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

export default YourEventsIndex;
