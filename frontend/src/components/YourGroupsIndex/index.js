import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserGroupsThunk } from "../../store/groups";
import GroupsIndexItem from "../GroupsIndexItem";
import { getEventsThunk } from "../../store/events";
import "./YourGroupsIndex.css";


function YourGroupsIndex() {
    const groupsObj = useSelector(state => state.groups.currentUserGroups);
    const groups = Object.values(groupsObj);
    const dispatch = useDispatch();
    const eventsObj = useSelector(state => state.events.allEvents)
    const events = Object.values(eventsObj);

    useEffect(() => {
        dispatch(getCurrentUserGroupsThunk())
        dispatch(getEventsThunk())
    }, [dispatch])

    return (
        <div className="groups-wrapper-wrapper">

        <div className="groups-wrapper">
            <h1 id="your-groups-header">Your Groups</h1>
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


export default YourGroupsIndex;
