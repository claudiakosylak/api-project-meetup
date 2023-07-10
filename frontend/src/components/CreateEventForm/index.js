import { useParams } from "react-router-dom";
import EventForm from "../EventForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getGroupThunk } from "../../store/groups";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const CreateEventForm = () => {
    const {groupId} = useParams();
    const group = useSelector(state => state.groups.currentGroup);
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupThunk(groupId))
    }, [dispatch, groupId])

    if (!user) {
        return <Redirect to="/"/>
    }

    const event = {
        name: "",
        type: "",
        price: 0,
        description: "",
        startDate: "",
        endDate: ""
    };

    return (
        <EventForm
            event={event}
            formType="Create Event"
            group={group}
        />
    )
}

export default CreateEventForm;
