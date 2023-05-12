import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";
import GroupDetailHeader from "./GroupDetailHeader";
import "./GroupDetailsIndex.css";
import GroupDetailDescription from "./GroupDetailDescription";
import { getGroupEventsThunk } from "../../store/events";
import GroupEventItem from "../GroupEventItem";

export const sortPastUpcomingEvents = events => {
    const currentDate = new Date();
    const orderedEvents = events.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
    })
    const pastEvents = orderedEvents.filter(event => new Date(event.startDate) < currentDate);
    const upcomingEvents = orderedEvents.filter(event => new Date(event.startDate) > currentDate);
    return [upcomingEvents, pastEvents];
}

const GroupDetailsIndex = () => {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups.currentGroup)
    const eventsObj = useSelector(state => state.events.currentGroupEvents)
    const events = Object.values(eventsObj)

    // let sortedEvents = sortEvents(events);
    const sortedEvents = sortPastUpcomingEvents(events);
    const numberUpcomingEvents = sortedEvents[0].length;
    const numberPastEvents = sortedEvents[1].length;

    useEffect(() => {
        dispatch(getGroupThunk(groupId));
        dispatch(getGroupEventsThunk(groupId));
    }, [dispatch, groupId])

    return (
        <div className="group-details-page-container">
            <GroupDetailHeader
                group={group}
                numberEvents={numberUpcomingEvents + numberPastEvents}
                user={sessionUser}
            />
            <GroupDetailDescription group={group} />
            <div className="upcoming-events">
                <div className="upcoming-events-inner-wrapper">
                    {(numberUpcomingEvents + numberPastEvents) === 0 ? (
                        <h2>No Upcoming Events</h2>
                    ) : (
                        <>

                    <h2>Events ({numberUpcomingEvents})</h2>
                    <ul className="group-events-list-container">
                        <div className="upcoming-events-container">
                            {sortedEvents[0]?.map(event => (
                                <GroupEventItem event={event} key={event.id} />
                            ))}

                        </div>
                        {sortedEvents[1].length > 0 && (
                            <div className="upcoming-events-container">
                                <h2>Past Events ({numberPastEvents})</h2>
                                {sortedEvents[1]?.map(event => (
                                    <GroupEventItem event={event} key={event.id} />
                                ))}
                            </div>

                        )}
                    </ul>
                        </>

                    )}

                </div>

            </div>

        </div>
    )
}

export default GroupDetailsIndex;
