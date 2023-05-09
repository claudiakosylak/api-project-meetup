import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import GroupForm from "../GroupForm";
import { getGroupThunk } from "../../store/groups";

const UpdateGroupForm = () => {
    const dispatch = useDispatch();
    const {groupId} = useParams();
    const group = useSelector(state => state.groups[groupId]);

    useEffect(() => {
        dispatch(getGroupThunk(groupId))
    }, [dispatch, groupId])

    if (!group) return(null);

    return (

            <GroupForm
                group={group}
                formType="Update Group"
            />

    )
}

export default UpdateGroupForm;
