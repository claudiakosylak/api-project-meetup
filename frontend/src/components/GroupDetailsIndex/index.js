import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";
import GroupDetailHeader from "./GroupDetailHeader";


const GroupDetailsIndex = () => {

    const dispatch = useDispatch();
    const {groupId} = useParams();
    const groups = useSelector(state => state.groups)
    const group = groups[groupId];

    useEffect(() => {
        dispatch(getGroupThunk(groupId));
    }, [dispatch, groupId])

    return (
        <div className="group-details-page-container">
            <GroupDetailHeader
                group={group}
            />
        </div>
    )
}

export default GroupDetailsIndex;
