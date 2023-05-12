import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";
import GroupDetailHeader from "./GroupDetailHeader";
import "./GroupDetailsIndex.css";
import GroupDetailDescription from "./GroupDetailDescription";
import { getGroupEventsThunk } from "../../store/events";
import GroupEventItem from "../GroupEventItem";
import { sortEvents } from "../EventsIndex";


const GroupDetailsIndex = () => {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const {groupId} = useParams();
    const group = useSelector(state => state.groups.currentGroup)
    const eventsObj = useSelector(state => state.events.currentGroupEvents)
    const events = Object.values(eventsObj)
    const numberEvents = events.length;

    let sortedEvents = sortEvents(events);

    useEffect(() => {
        dispatch(getGroupThunk(groupId));
        dispatch(getGroupEventsThunk(groupId));
    }, [dispatch, groupId])

    return (
        <div className="group-details-page-container">
            <GroupDetailHeader
                group={group}
                numberEvents={numberEvents}
                user={sessionUser}
            />
            <GroupDetailDescription group={group}/>
            <div className="upcoming-events">
                <div className="upcoming-events-inner-wrapper">

            <h2>Events: {numberEvents}</h2>
            <ul className="group-events-list-container">
                {sortedEvents?.map(event => (
                    <GroupEventItem event={event} key={event.id} />
                ))}
            </ul>
                </div>

            </div>

        </div>
    )
}

export default GroupDetailsIndex;
