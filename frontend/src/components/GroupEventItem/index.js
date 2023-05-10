import { useDispatch, useSelector } from "react-redux";
import { getEventThunk } from "../../store/events";
import { useEffect } from "react";
import "./GroupEventItem.css";


const GroupEventItem = ({event}) => {

    const eventId = event.id;

    const dispatch = useDispatch();

    const fullEvent = useSelector(state => state.events.currentEvent)

    useEffect(() => {
        dispatch(getEventThunk(eventId))
    }, [dispatch])

    console.log("THIS IS FULL EVENT: ", fullEvent)

    // if (!fullEvent.description) return null;

    return (
        <li className="event-item-container-box">
            <div className="event-item-top-half">
                <div className="main-event-pic-placeholder"></div>
                <div className="event-item-top-half-text">
                    <p>{fullEvent.startDate}</p>
                    <h3 className="event-list-title">{fullEvent.name}</h3>
                    <p>{fullEvent.city}, {fullEvent.state}</p>
                </div>
            </div>
            <p>{fullEvent.description}</p>
        </li>
    )
}

export default GroupEventItem;
