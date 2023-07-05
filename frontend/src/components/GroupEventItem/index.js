import { Link } from "react-router-dom";
import { timeCleaner } from "../EventsIndexItem";
import "./GroupEventItem.css";
import { dateTransformer } from "../EventsIndexItem";
import { cleanedDateString } from "../EventsIndexItem";


const GroupEventItem = ({event}) => {

    let splitStartDate = event.startDate.split("T");
    const startDay = splitStartDate[0];
    let startTime = splitStartDate[1];
    const cleanedStartTime = timeCleaner(startTime);

    return (
        <Link to={`/events/${event.id}`} className="event-item-container-box">
            <div className="event-item-top-half">
                <img className="main-event-pic-placeholder" src={event.previewImage}
                onError={e => { e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg" }} ></img>
                <div className="event-item-top-half-text">
                    <p id="group-event-date">{cleanedDateString(dateTransformer(event.startDate))}</p>
                    <h3 className="event-list-title">{event.name}</h3>
                    <p className="group-event-type">{event.type}</p>
                </div>
            </div>
        </Link>
    )
}

export default GroupEventItem;
