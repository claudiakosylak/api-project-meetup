import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import GroupForm from "../GroupForm";
import { getGroupThunk } from "../../store/groups";
import { useHistory } from "react-router-dom";

const UpdateGroupForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {groupId} = useParams();
    const group = useSelector(state => state.groups.currentGroup);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getGroupThunk(groupId))
    }, [dispatch, groupId])

    if (!group) return(null);
    if (!sessionUser) {
        history.push("/");
        return null;
    }
    if (!sessionUser || sessionUser.id !== group.organizerId){
     history.push("/");
     return null;
    }

    return (

            <GroupForm
                group={group}
                formType="Update Group"
            />

    )
}

export default UpdateGroupForm;
