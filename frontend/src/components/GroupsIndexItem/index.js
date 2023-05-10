import { Link } from "react-router-dom";
import "./GroupsIndexItem.css";
import { useDispatch, useSelector } from "react-redux";
import { getGroupEventsThunk } from "../../store/events";
import { useEffect } from "react";


const GroupsIndexItem = ({ group, events }) => {

    const groupEvents = events.filter(event => event.groupId === group.id);
    // useEffect(() => {
    //     dispatch(getGroupEventsThunk(group.id))
    // }, [dispatch, group.id])


    // if (!events) return null;

    return (
            <Link to={`/groups/${group.id}`} className="groups-index-item-container">
                <img src={group.previewImage} className="group-image-placeholder"></img>
                <div className="group-index-text-container">
                    <h2 className="group-list-header">{group.name}</h2>
                    <p className="list-location">{group.city}, {group.state}</p>

                    <p className="group-index-about">{group.about.length > 97 ?
                    (group.about.slice(0, 97)) + "..." : (group.about)
                }</p>
                    <div className="under-groups-text-container">
                        <p>{groupEvents.length} Events</p>
                        <p>•</p>
                        <p>{group.private ? "Private" : "Public"}</p>
                    </div>
                </div>
            </Link>
    )
}


export default GroupsIndexItem;
