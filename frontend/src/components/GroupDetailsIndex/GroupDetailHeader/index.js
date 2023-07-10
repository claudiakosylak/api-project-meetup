import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./GroupDetailHeader.css";
import DeleteGroupModal from "../../DeleteGroupModal";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { createMembershipThunk, getCurrentUserGroupsAction, getCurrentUserGroupsThunk } from "../../../store/groups";
import LeaveGroupModal from "../../LeaveGroupModal";

const GroupDetailHeader = ({ group, numberEvents, user }) => {
    const dispatch = useDispatch();
    const userGroupsObj = useSelector(state => state.groups.currentUserGroups)
    let userGroupsSet = new Set();
    for (let group in userGroupsObj) {
        userGroupsSet.add(`${group}`)
    }

    useEffect(() => {
        dispatch(getCurrentUserGroupsThunk())
    }, [dispatch])

    if (!group.Organizer) return null;

    const groupPreviewImage = group.GroupImages.find(image => image.preview = true)

    const createMembership = async (e) => {
        await dispatch(createMembershipThunk(group.id))
        await dispatch(getCurrentUserGroupsAction())
        return alert("You are now a member!")
    }

    return (
        <div className="group-header-component-container">
            <div className="group-left-container">
                <div className="back-groups-link">

                    <Link to="/groups" id="go-back-groups"><i class="fa-solid fa-angle-left"></i> Groups</Link>
                </div>
                <div ><img src={groupPreviewImage.url} className="group-image-placeholder-details-page"
                    onError={e => { e.currentTarget.src = "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg" }} ></img></div>

            </div>
            <div className="group-detail-text-container-details-page">
                <div className="group-detail-text-top">
                    <h1>{group.name}</h1>
                    <p>{group.city}, {group.state}</p>
                    <div className="event-public-container">
                        <p>{`${numberEvents} Events`}</p>
                        <p>•</p>
                        <p>{group.private ? "Private" : "Public"}</p>
                    </div>
                    <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>

                </div>

                {(user && user.id === group.Organizer.id) && (
                    <div className="admin-group-buttons">
                        <Link to={`/groups/${group.id}/events/new`} className="admin-group-button">Create event</Link>
                        <Link to={`/groups/${group.id}/edit`} className="admin-group-button">Update</Link>

                        <div className="admin-group-button">
                            <OpenModalMenuItem
                                itemText="Delete"
                                modalComponent={<DeleteGroupModal className="modal-container-delete" groupId={group.id} />}
                            /></div>
                    </div>
                )}
                {(!userGroupsSet.has(`${group.id}`)) && (

                    <button className="join-group-button"
                        onClick={createMembership}
                    >Join this group</button>
                )}
                {(userGroupsSet.has(`${group.id}`) && user && user.id !== group.Organizer.id) && (
                    <div className="admin-group-button">
                        <OpenModalMenuItem
                            itemText="Leave Group"
                            modalComponent={<LeaveGroupModal className="modal-container-delete" groupId={group.id}/>}/>
                    </div>
                )}

            </div>
        </div>
    )
}


export default GroupDetailHeader;
