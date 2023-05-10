import { useDispatch, useSelector } from "react-redux";
import { getEventThunk } from "../../store/events";
import { useEffect } from "react";
import "./GroupEventItem.css";


const GroupEventItem = ({event}) => {



    return (
        <li className="event-item-container-box">
            <div className="event-item-top-half">
                <div className="main-event-pic-placeholder"></div>
                <div className="event-item-top-half-text">
                    <p>{event.startDate}</p>
                    <h3 className="event-list-title">{event.name}</h3>
                </div>
            </div>
        </li>
    )
}

export default GroupEventItem;
