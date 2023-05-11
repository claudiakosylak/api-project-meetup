import { useDispatch, useSelector } from "react-redux";
import "./EventDetailsIndex.css";
import { useParams } from "react-router-dom";
import { getEventThunk } from "../../store/events";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";
import { timeCleaner } from "../EventsIndexItem";

const EventDetailsIndex = () => {
    const dispatch = useDispatch()
    const { eventId } = useParams();
    const event = useSelector(state => state.events.currentEvent)
    const group = useSelector(state => state.groups.currentGroup)

    let splitStartDate = event.startDate.split("T");
    const startDay = splitStartDate[0];
    let startTime = splitStartDate[1];
    const cleanedStartTime = timeCleaner(startTime);

    let splitEndDate = event.endDate.split("T");
    const endDay = splitEndDate[0];
    let endTime = splitEndDate[1];
    const cleanedEndTime = timeCleaner(endTime);

    console.log("THE EVENT, ", event)

    console.log("THE GROUPID: ", event.groupId)

    useEffect(() => {
        dispatch(getEventThunk(eventId))
        dispatch(getGroupThunk(event.groupId))
    }, [dispatch, eventId])

   

    // if (!event) return null;

    // if (!event.EventImages) return null;
    // if (!group) return null;

    console.log("group preview image", group.previewImage)

    const eventPreviewImage = event.EventImages.find(image => image.preview === true)

    return (
        <div className="event-details-page-container">
            <div className="event-header">
                <p>{"<"}<Link to="/events">Events</Link></p>
                <h2 className="event-page-title">{event.name}</h2>
                {/* <p>Organized by: {group.Organizer.firstName} {group.Organizer.lastName}</p> */}
            </div>
            <div className="event-details-middle-section">
                <img className="event-details-page-image-placeholder" src={eventPreviewImage.url}></img>
                <div className="event-details-right-info">
                    <Link to={`/groups/${event.groupId}`} className="event-group-chunk">
                        <img className="event-group-image-placeholder" src={group.previewImage}></img>
                        <div className="event-group-info-text">
                            <p>{event.Group.name}</p>
                            <p>{event.Group.private ? "Private" : "Public"}</p>
                        </div>
                    </Link>
                    <div className="event-micro-details">
                        <div className="event-time-details">
                            <i className="fa-regular fa-clock"></i>
                            <div className="start-end-time">
                                <p>START {startDay} • {cleanedStartTime}</p>
                                <p>END {endDay} • {cleanedEndTime}</p>
                            </div>
                        </div>
                        <div className="event-price">
                            <i className="fa-thin fa-circle-dollar"></i>
                            <p>${event.price}</p>
                        </div>
                        <div className="event-location-details">
                        <i class="fa-sharp fa-solid fa-map-pin"></i>
                        <p>{event.type}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="event-details-bottom-section">
                <h3>Details</h3>
                <p>{event.description}</p>
            </div>
        </div >
    )
}

export default EventDetailsIndex;
