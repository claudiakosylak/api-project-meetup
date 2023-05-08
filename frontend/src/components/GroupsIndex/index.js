import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupsThunk } from "../../store/groups";
import GroupsIndexItem from "../GroupsIndexItem";



function GroupsIndex() {
    const groupsObj = useSelector(state => state.groups)
    const groups = Object.values(groupsObj);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupsThunk())
    }, [dispatch])


    return (
        <div className="groups-wrapper">
            this is the groups page
            <ul className="groups-index-list-container">
                {groups.map((group) => (
                    <GroupsIndexItem
                        group={group}
                        key={group.id}
                    />
                ))}
            </ul>
        </div>
    )
}


export default GroupsIndex;
