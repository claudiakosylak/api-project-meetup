import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupsThunk } from "../../store/groups";
import GroupsIndexItem from "../GroupsIndexItem";
import "./GroupsIndex.css";
import { Link } from "react-router-dom";
import { getEventsThunk } from "../../store/events";



function GroupsIndex() {
    const groupsObj = useSelector(state => state.groups.allGroups);
    const groups = Object.values(groupsObj);
    const dispatch = useDispatch();
    const eventsObj = useSelector(state => state.events.allEvents)
    const events = Object.values(eventsObj);

    useEffect(() => {
        dispatch(getGroupsThunk())
        dispatch(getEventsThunk())
    }, [dispatch])

    return (
        <div className="groups-wrapper-wrapper">

        <div className="groups-wrapper">
            <nav className="groups-nav">
                <Link to="/events" className="groups-nav-item inactive-group-event-tab">Events</Link>
                <Link to="/groups" className="groups-nav-item active-group-event-tab">Groups</Link>
            </nav>
            <p className="groups-subheader">Groups in ReadUp</p>
            <ul className="groups-index-list-container">
                {groups?.map((group) => (
                    <GroupsIndexItem
                        group={group}
                        events={events}
                        key={group.id}
                    />
                ))}
            </ul>
        </div>
        </div>
    )
}


export default GroupsIndex;
