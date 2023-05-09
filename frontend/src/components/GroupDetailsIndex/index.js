import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";
import GroupDetailHeader from "./GroupDetailHeader";
import "./GroupDetailsIndex.css";
import GroupDetailDescription from "./GroupDetailDescription";
import { getGroupEventsThunk } from "../../store/events";
import GroupEventItem from "../GroupEventItem";


const GroupDetailsIndex = () => {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const {groupId} = useParams();
    const group = useSelector(state => state.groups[groupId])
    const eventsObj = useSelector(state => state.events)
    const events = Object.values(eventsObj)
    const numberEvents = events.length;

    useEffect(() => {
        dispatch(getGroupThunk(groupId));
    }, [dispatch, groupId])

    useEffect(() => {
        dispatch(getGroupEventsThunk(groupId))
    }, [dispatch, groupId])

    if (!group) return null;

    return (
        <div className="group-details-page-container">
            <GroupDetailHeader
                group={group}
                numberEvents={numberEvents}
            />
            <GroupDetailDescription group={group}/>
            <h2>Upcoming Events: {numberEvents}</h2>
            <ul className="group-events-list-container">
                {events.map(event => (
                    <GroupEventItem event={event} key={event.id} />
                ))}
            </ul>

        </div>
    )
}

export default GroupDetailsIndex;
