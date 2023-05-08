import { Link } from "react-router-dom/cjs/react-router-dom.min"



const GroupsIndexItem = ({group}) => {
    console.log("GROUP INSIDE GROUPINDEXITEM COMPONENT: ", group)

    return (
        <li className="groups-index-item-container">
            <Link to={`/groups/${group.id}`}>{group.name}</Link>
        </li>
    )
}


export default GroupsIndexItem;
