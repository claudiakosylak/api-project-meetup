import { useDispatch } from "react-redux";
import { deleteGroupThunk } from "../../store/groups";
import { useHistory } from "react-router-dom";
import {useModal} from "../../context/Modal";


function DeleteGroupModal({groupId}) {
    const dispatch = useDispatch()
    const {closeModal} = useModal();
    const history = useHistory();


    const handleDelete = () => {
        return dispatch(deleteGroupThunk(groupId)).then(history.push("/groups")).then(closeModal);
    }

    return (
        <div className="delete-modal-container">
            <h1>Confirm Delete</h1>
            <button className="yes-delete-button" onClick={handleDelete}>Yes (Delete Group)</button>
            <button className="no-delete-button" onClick={closeModal}>No (Keep Group)</button>
        </div>
    )
}

export default DeleteGroupModal;
