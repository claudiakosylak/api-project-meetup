import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";
import GroupDetailHeader from "./GroupDetailHeader";


const GroupDetailsIndex = () => {

    const dispatch = useDispatch();
    const {groupId} = useParams();
    console.log("THIS IS GROUPID: ", groupId)
    const group = useSelector(state => state.groups[groupId])
    // console.log("THIS IS THE STATE GROUPS: ", groups)
    // const group = groups[groupId];

    console.log("THIS IS THE GROUP: ", group)

    useEffect(() => {
        console.log("THIS IS INSIDE USEEFFECT:", groupId)
        dispatch(getGroupThunk(groupId));
    }, [dispatch, groupId])

    if (!group) return null;

    return (
        <div className="group-details-page-container">
            <GroupDetailHeader
                group={group}
            />
        </div>
    )
}

export default GroupDetailsIndex;
