import { useDispatch, useSelector } from "react-redux";
import "./EventDetailsIndex.css";
import { useParams } from "react-router-dom";
import { getEventThunk } from "../../store/events";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUserGroupsThunk, getGroupThunk } from "../../store/groups";
import { timeCleaner } from "../EventsIndexItem";
import DeleteEventModal from "../DeleteEventModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { dateTransformer } from "../EventsIndexItem";
import { cleanedDateString } from "../EventsIndexItem";
import { getEventAttendeesThunk } from "../../store/attendances";


const EventDetailsIndex = () => {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const event = useSelector(state => state.events.currentEvent);
    const group = useSelector(state => state.groups.currentGroup);
    const attendances = useSelector(state => state.attendees.attendees);
    const userGroups = useSelector(state => state.groups.currentUserGroups);
    console.log("ATTENDANCES: ", attendances)
    console.log("USER GROUPS: ", userGroups)
    console.log("GROUP: ", group)

    let attendeeSet = new Set();
    for (let attendee in attendances) {
        attendeeSet.add(`${attendee}`)
    }
    let userGroupSet = new Set();
    for (let group in userGroups) {
        userGroupSet.add(`${group}`)
    }

    console.log("USER GORUP SET: ", userGroupSet)

    console.log("ATTENDANCE HAS: ", attendeeSet.has(`${sessionUser.id}`))
    console.log("GROUPS HAS: ", userGroupSet.has(`${group.id}`))

    useEffect(() => {
        dispatch(getEventThunk(eventId)).then((receivedEvent) => dispatch(getGroupThunk(receivedEvent.groupId)));
    }, [dispatch, eventId])

    useEffect(() => {
        dispatch(getEventAttendeesThunk(eventId))
        dispatch(getCurrentUserGroupsThunk())
    }, [dispatch])

    if (!eventId) return null;
    if (!event.id) return null;
    if (!group.id) return null;

    let splitStartDate = event.startDate.split("T");
    const startDay = splitStartDate[0];
    let startTime = splitStartDate[1];
    const cleanedStartTime = timeCleaner(startTime);

    let splitEndDate = event.endDate?.split("T");
    const endDay = splitEndDate[0];
    let endTime = splitEndDate[1];
    const cleanedEndTime = timeCleaner(endTime);


    const eventPreviewImage = event?.EventImages?.find(image => image.preview === true);
    const groupPreviewImage = group?.GroupImages.find(image => image.preview === true);

    return (
        <div className="event-details-page-container">
            <div className="event-header-wrapper">

                <div className="event-header">
                    <Link to="/events" id="go-back-events"><i class="fa-solid fa-angle-left"></i> Events</Link>
                    <h1 className="event-page-title">{event.name}</h1>
                    <p className="event-host">Hosted by: {group?.Organizer?.firstName} {group?.Organizer?.lastName}</p>
                </div>
            </div>
            <div className="event-details-main-content">


                <div className="event-details-middle-top">

                    <img className="event-details-page-image-placeholder" src={eventPreviewImage?.url}
                        onError={e => { e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg" }} ></img>
                    <div className="event-details-right-info">
                        <Link to={`/groups/${event.groupId}`} className="event-group-chunk">
                            <img className="event-group-image-placeholder" src={groupPreviewImage?.url}
                                onError={e => { e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg" }} ></img>
                            <div className="event-group-info-text">
                                <p className="event-page-group-title">{event?.Group?.name}</p>
                                <p className="group-priv">{event?.Group?.private ? "Private" : "Public"}</p>
                            </div>
                        </Link>
                        <div className="event-micro-details">
                            <div className="event-time-details">
                                <i className="fa-regular fa-clock"></i>
                                <div className="start-end-time">
                                    <p className="time-block"><span className="grey-micro">START</span> <span>{cleanedDateString(dateTransformer(event.startDate))}</span></p>
                                    <p className="time-block"><span className="grey-micro">END  </span>  <span>{cleanedDateString(dateTransformer(event.endDate))}</span></p>
                                </div>
                            </div>
                            <div className="event-price">
                                <p className="fa-circle-dollar">$</p>
                                {(event.price === 0 || event.price === "0") ? (
                                    <p>FREE</p>
                                ) : <p>{event.price}</p>}

                            </div>
                            <div className="event-location-details">
                                <i class="fa-sharp fa-solid fa-map-pin"></i>
                                <p className="event-type-micro-text">{event.type}</p>
                                {(sessionUser && sessionUser.id === group.Organizer.id) && (
                                    <div className="update-delete-buttons">

                                        {/* <button className="event-delete-button">Update</button> */}

                                        <div className="event-delete-button">
                                            <OpenModalMenuItem
                                                itemText="Delete"
                                                modalComponent={<DeleteEventModal event={event} groupId={group.id} />}
                                            />
                                        </div>

                                    </div>
                                )}
                                {(!attendeeSet.has(`${sessionUser.id}`) && userGroupSet.has(`${group.id}`)) && (
                                    <button className="join-group-button">Attend</button>
                                )}
                                {!userGroupSet.has(`${group.id}`) && (
                                    <p>Join the group to attend this event!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="event-details-bottom-section">
                    <h3>Description</h3>
                    <p className="main-event-description">{event.description}</p>
                </div>

            </div>
        </div >
    )
}

export default EventDetailsIndex;
