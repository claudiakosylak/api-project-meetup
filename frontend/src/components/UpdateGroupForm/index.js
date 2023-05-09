import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import GroupForm from "../GroupForm";

const UpdateGroupForm = () => {
    const dispatch = useDispatch();
    const {groupId} = useParams();
    const group = useSelector(state => state.groups[groupId]);

    if (!group) return(null);

    return (
        Object.keys(group).length > 1 && (
            <GroupForm
                group={group}
                formType="Update Group"
            />
        )
    )
}

export default UpdateGroupForm;
