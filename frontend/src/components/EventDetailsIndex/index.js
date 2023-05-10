import { useDispatch, useSelector } from "react-redux";
import "./EventDetailsIndex.css";
import { useParams } from "react-router-dom";
import { getEventThunk } from "../../store/events";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";

const EventDetailsIndex = () => {
    const dispatch = useDispatch()
    const { eventId } = useParams();
    const event = useSelector(state => state.events.currentEvent)
    // const groupId = event.Group.id;
    // const group = useSelector(state => state.groups[event.groupId])


    useEffect(() => {
        dispatch(getEventThunk(eventId))
    }, [dispatch, eventId])

    // useEffect(() => {
    //     dispatch(getGroupThunk(event.groupId))
    // }, [dispatch, event])

    if (!event) return null;
    // if (!group.Organizer) return null;
    // if (!event.Group) return null;


    return (
        <div className="event-details-page-container">
            <div className="event-header">
                <p>{"<"}<Link to="/events">Events</Link></p>
                <h2 className="event-page-title">{event.name}</h2>
                <p>Organized by:</p>
            </div>
            <div className="event-details-middle-section">
                <div className="event-details-page-image-placeholder"></div>
                <div className="event-details-right-info">
                    <Link to={`/groups/${event.groupId}`} className="event-group-chunk">
                        <div className="event-group-image-placeholder"></div>
                        <div className="event-group-info-text">
                            <p>Group name placeholder</p>
                            <p>Group status placeholder</p>
                        </div>
                    </Link>
                    <div className="event-micro-details">
                        <div className="event-time-details">
                            <i className="fa-regular fa-clock"></i>
                            <div className="start-end-time">
                                <p>START {event.startDate}</p>
                                <p>END {event.endDate}</p>
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
