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
    const group = useSelector(state => state.groups.currentGroup)
    const eventsObj = useSelector(state => state.events.currentGroupEvents)
    const events = Object.values(eventsObj)
    const numberEvents = events.length;

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
            <h2>Upcoming Events: {numberEvents}</h2>
            <ul className="group-events-list-container">
                {events?.map(event => (
                    <GroupEventItem event={event} key={event.id} />
                ))}
            </ul>

        </div>
    )
}

export default GroupDetailsIndex;
