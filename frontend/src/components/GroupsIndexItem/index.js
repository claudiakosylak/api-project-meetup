import { Link } from "react-router-dom/cjs/react-router-dom.min"
import "./GroupsIndexItem.css";



const GroupsIndexItem = ({group}) => {

    return (
        <li className="groups-index-item-container">
            <div className="group-image-placeholder"></div>
            <div className="group-index-text-container">
            <h2><Link to={`/groups/${group.id}`}>{group.name}</Link></h2>
            <p>{group.city}, {group.state}</p>
            <p>{group.about}</p>
            <div className="under-groups-text-container">
                <p>## Events</p>
                <p>{group.private ? "Private" : "Public"}</p>
            </div>
            </div>
        </li>
    )
}


export default GroupsIndexItem;
