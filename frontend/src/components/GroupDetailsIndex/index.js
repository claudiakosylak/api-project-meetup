import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";

const GroupDetailsIndex = () => {

    const dispatch = useDispatch();
    const { groupId } = useParams();
    const groups = useSelector(state => state.groups)
    const group = groups[groupId];

    useEffect(() => {
        dispatch(getGroupThunk(groupId));
    }, [dispatch, groupId])

    return (
        <div className="group-details-page-container">
            <div className="group-header-container">
                <h1>{group.name}</h1>

            </div>
        </div>
    )
}

export default GroupDetailsIndex;
