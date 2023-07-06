import { useDispatch, useSelector } from "react-redux";
import {useModal} from "../../context/Modal";
import { deleteAttendanceThunk } from "../../store/attendances";


function CancelAttendanceModal({eventId, userId}) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const user = useSelector(state => state.session.user)

    const handleCancel = () => {
        dispatch(deleteAttendanceThunk(eventId, userId))
        closeModal()
    }

    return (
        <div className="delete-modal-container">
            <h1>Please Confirm</h1>
            <p>Are you sure you want to cancel your attendance?</p>
            <button className="yes-delete-button delete-buttons" onClick={handleCancel}>Yes (Cancel)</button>
            <button className="no-delete-button delete-buttons" onClick={closeModal}>No (Attend)</button>
        </div>
    )
}

export default CancelAttendanceModal;
