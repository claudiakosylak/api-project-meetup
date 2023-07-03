import { Link } from "react-router-dom";
import "./GroupsIndexItem.css";

const GroupsIndexItem = ({ group, events }) => {

    const groupEvents = events.filter(event => event.groupId === group.id);

    return (
            <Link to={`/groups/${group.id}`} className="groups-index-item-container">
                <img src={group.previewImage} className="group-image-placeholder"
                onError={e => { e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg" }} ></img>
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
