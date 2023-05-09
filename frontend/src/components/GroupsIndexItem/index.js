import { Link } from "react-router-dom/cjs/react-router-dom.min"
import "./GroupsIndexItem.css";
import { useDispatch, useSelector } from "react-redux";
import { getGroupEventsThunk } from "../../store/events";
import { useEffect } from "react";



const GroupsIndexItem = ({group}) => {
    const eventsObj = useSelector(state => state.events)
    const events = Object.values(eventsObj)
    console.log(`EVENTS FOR GROUP # ${group.id}: ${events}`)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupEventsThunk(group.id))
    }, [dispatch, group.id])

    return (
        <li className="groups-index-item-container">
            <div className="group-image-placeholder"></div>
            <div className="group-index-text-container">
            <h2><Link className="group-list-header" to={`/groups/${group.id}`}>{group.name}</Link></h2>
            <p>{group.city}, {group.state}</p>
            <p className="group-index-about">{group.about}</p>
            <div className="under-groups-text-container">
                <p>{events.length} Events</p>
                <p>•</p>
                <p>{group.private ? "Private" : "Public"}</p>
            </div>
            </div>
        </li>
    )
}


export default GroupsIndexItem;
