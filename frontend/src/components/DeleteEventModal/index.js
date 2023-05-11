import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {useModal} from "../../context/Modal";
import { deleteEventThunk } from "../../store/events";



function DeleteEventModal({event, groupId}) {
    const dispatch = useDispatch()
    const {closeModal} = useModal();
    const history = useHistory();
    // if (!event) return null;
    // const groupId = event.groupId;

    // if (!groupId) return null;
    const handleDelete = () => {
        return dispatch(deleteEventThunk(event.id)).then(history.push(`/groups/${groupId}`)).then(closeModal);
    }

    return (

        <div className="delete-modal-container">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this event?</p>
            <button className="yes-delete-button delete-buttons" onClick={handleDelete}>Yes (Delete Event)</button>
            <button className="no-delete-button delete-buttons" onClick={closeModal}>No (Keep Event)</button>
        </div>

    )
}

export default DeleteEventModal;
