import { Link } from "react-router-dom";
import { timeCleaner } from "../EventsIndexItem";
import "./GroupEventItem.css";



const GroupEventItem = ({event}) => {

    let splitStartDate = event.startDate.split("T");
    const startDay = splitStartDate[0];
    let startTime = splitStartDate[1];
    const cleanedStartTime = timeCleaner(startTime);

    return (
        <Link to={`/events/${event.id}`} className="event-item-container-box">
            <div className="event-item-top-half">
                <img className="main-event-pic-placeholder" src={event.previewImage}></img>
                <div className="event-item-top-half-text">
                    <p>{startDay} • {cleanedStartTime}</p>
                    <h3 className="event-list-title">{event.name}</h3>
                    <p className="group-event-type">{event.type}</p>
                </div>
            </div>
        </Link>
    )
}

export default GroupEventItem;
