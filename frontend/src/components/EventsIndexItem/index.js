import "../GroupsIndexItem/GroupsIndexItem.css";
import { Link } from "react-router-dom";
import "./EventsIndexItem.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEventThunk } from "../../store/events";

export const timeCleaner = prevTime => {
    let time = prevTime.split(":");
    time = time.slice(0, 2);
    let amPM;
    if (time[0] < 12) {
        amPM = "AM";
    } else if (time[0] === 12) {
        amPM = "PM";
    } else {
        time[0]-= 12;
        amPM = "PM";
    }

    return `${time[0]}:${time[1]} ${amPM}`;
}

const EventsIndexItem = ({ event }) => {
    let splitStartDate = event.startDate.split("T");
    const startDay = splitStartDate[0];
    let startTime = splitStartDate[1];
    const cleanedStartTime = timeCleaner(startTime);



    return (
        <Link to={`/events/${event.id}`} className="events-index-item-container">
            <div className="event-index-top">
                <img className="group-image-placeholder" src={event.previewImage}
                onError={e => { e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg" }} ></img>
                <div className="event-index-text-container">
                    <div className="under-groups-text-container"><p>{startDay} • {cleanedStartTime}</p>
                    </div>
                    <h2 className="group-list-header">{event.name}</h2>
                    <p className="event-type-text">{event.type}</p>
                </div>
            </div>
        </Link >
    )
}

export default EventsIndexItem;
