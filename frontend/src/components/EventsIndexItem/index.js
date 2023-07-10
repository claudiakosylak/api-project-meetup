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
        time[0] -= 12;
        amPM = "PM";
    }

    return `${time[0]}:${time[1]} ${amPM}`;
}

export const dateTransformer = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getUTCFullYear()
    const dayOfWeek = dateObj.getUTCDay()
    const daysOfWeek = {
        1: "MON",
        2: "TUE",
        3: "WED",
        4: "THU",
        5: "FRI",
        6: "SAT",
        0: "SUN"
    }
    const months = {
        0: "JAN",
        1: "FEB",
        2: "MAR",
        3: "APR",
        4: "MAY",
        5: "JUN",
        6: "JUL",
        7: "AUG",
        8: "SEP",
        9: "OCT",
        10: "NOV",
        11: "DEC"
    }
    const month = dateObj.getUTCMonth()
    const day = dateObj.getUTCDate()
    let hour = dateObj.getUTCHours()
    let amPm

    if (hour > 12) {
        hour -= 12;
        amPm = "PM"
    } else if (hour < 12) {
        amPm = "AM"
    } else {
        amPm = "PM"
    }

    let minutes = dateObj.getUTCMinutes()
    if (minutes < 10) {
        minutes = "0" + minutes.toString()
    }

    return {
        dayOfWeek: daysOfWeek[dayOfWeek],
        month: months[month],
        day: day,
        hour: hour,
        minutes: minutes,
        amPm: amPm,
        year: year
    }
}

export const cleanedDateString = (dateObj) => {
    return `${dateObj.dayOfWeek}, ${dateObj.month} ${dateObj.day} • ${dateObj.hour}:${dateObj.minutes} ${dateObj.amPm}`
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
                    <div className="under-groups-text-container"><p id="event-start-time-list">{cleanedDateString(dateTransformer(event.startDate))}</p>
                    </div>
                    <h2 className="group-list-header">{event.name}</h2>
                    <p className="event-type-text">{event.type}</p>
                    <p className="group-index-about">{event.description.length > 75 ? (
                        event.description.slice(0, 74) + "..."
                    ) : (
                        event.description
                    )}</p>
                </div>
            </div>
        </Link >
    )
}

export default EventsIndexItem;
