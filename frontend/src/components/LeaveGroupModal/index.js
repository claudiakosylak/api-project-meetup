import { useDispatch, useSelector } from "react-redux";
import {useModal} from "../../context/Modal";
import { deleteMembershipThunk } from "../../store/groups";

function LeaveGroupModal({groupId}) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const user = useSelector(state => state.session.user)

    const handleLeave = () => {
        dispatch(deleteMembershipThunk(groupId, user.id))
        closeModal()
    }

    return (
        <div className="delete-modal-container">
            <h1>Please Confirm</h1>
            <p>Are you sure you want to leave this group?</p>
            <button className="yes-delete-button delete-buttons" onClick={handleLeave}>Yes (Leave Group)</button>
            <button className="no-delete-button delete-buttons" onClick={closeModal}>No (Stay in Group)</button>
        </div>
    )
}

export default LeaveGroupModal;
