import { csrfFetch } from "./csrf";
//action variables here

const GET_GROUPS = "groups/getGroups";
const GET_GROUP = "groups/getGroup";
const UPDATE_GROUP = "groups/updateGroup";
const DELETE_GROUP = "groups/deleteGroup";
const CREATE_GROUP_IMAGE = "groups/createGroupImage";
const GET_CURRENT_USER_GROUPS = "groups/getCurrentUserGroups";
//actions here

export const getGroupsAction = groups => ({
    type: GET_GROUPS,
    groups
})

export const getGroupAction = group => ({
    type: GET_GROUP,
    group
})

export const updateGroupAction = group => ({
    type: UPDATE_GROUP,
    group
})

export const deleteGroupAction = groupId => ({
    type: DELETE_GROUP,
    groupId
})

export const createGroupImageAction = (group, image) => ({
    type: CREATE_GROUP_IMAGE,
    group,
    image
})

export const getCurrentUserGroupsAction = (groups) => ({
    type: GET_CURRENT_USER_GROUPS,
    groups
})

// thunks here

// gets all groups that exist
export const getGroupsThunk = () => async (dispatch) => {
    const res = await fetch("/api/groups");
    const allGroups = await res.json();
    if (res.ok) {
        await dispatch(getGroupsAction(allGroups))
    }
}

// gets all groups the user is an organizer or member of
export const getCurrentUserGroupsThunk = () => async dispatch => {
    const res = await fetch("/api/groups/current");
    const userGroups = await res.json();
    if (res.ok) {
        await dispatch(getCurrentUserGroupsAction(userGroups))
    }
}

// gets details of a single group
export const getGroupThunk = (groupId) => async dispatch => {
    const res = await fetch(`/api/groups/${groupId}`);
    if (res.ok) {
        const group = await res.json();
        await dispatch(getGroupAction(group))
        return group;
    } else {
        const error = await res.json();
        return error;
    }
}


// creates a new group
export const createGroupThunk = (group) => async dispatch => {
    try {
        const res = await csrfFetch("/api/groups", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(group)
        })

        if (res.ok) {
            const newGroup = await res.json();
            await dispatch(getGroupAction(newGroup))
            return newGroup;
        }
        else {
            const err = await res.json();
            return err;
        }

    } catch(err) {
        return err;
    }
}

export const updateGroupThunk = (groupId, group) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
    })
    if (res.ok) {
        const updatedGroup = await res.json();
        dispatch(updateGroupAction(updatedGroup))
        return updatedGroup;
    } else {
        const err = await res.json()
        return err;
    }
}

export const deleteGroupThunk = groupId => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {method: "DELETE"})
    if (res.ok) {
        const successMessage = await res.json();
        dispatch(deleteGroupAction(groupId))
        return successMessage;
    } else {
        const err = await res.json();
        return err;
    }
}

export const createGroupImageThunk = (group, image) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${group.id}/images`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image)
    })
    if (res.ok) {
        const newImage = await res.json();
        await dispatch(createGroupImageAction(group, newImage))
        return newImage;
    } else {
        const err = await res.json();
        return err;
    }
}

// creates a new membership / joins a user to a group
export const createMembershipThunk = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
        const newMembership = await res.json();
        const res2 = await fetch("/api/groups/current")
        if (res2.ok) {
            const currGroups = await res2.json();
            await dispatch(getCurrentUserGroupsAction(currGroups))
        }
        return newMembership;
    } else {
        const err = await res.json();
        return err;
    }
}

// deletes a membership / lets user leave a group
export const deleteMembershipThunk = (groupId, memberId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "memberId": memberId
        })
    })
    if (res.ok) {
        const success = await res.json();
        const res2 = await fetch("/api/groups/current")
        if (res2.ok) {
            const currGroups = await res2.json();
            await dispatch(getCurrentUserGroupsAction(currGroups))
        }
        return success;
    } else {
        const err = await res.json();
        return err;
    }
}


// reducer here


const initialState = {allGroups: {}, currentGroup: {}, currentUserGroups: {}};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GROUPS:
            const groupsState = { ...state, allGroups: {}, currentGroup: {}, currentUserGroups: {...state.currentUserGroups}};
            action.groups.Groups.forEach(group => {
                groupsState.allGroups[group.id] = group;
            });
            return groupsState;
        case GET_GROUP:
            const newState = {...state, allGroups: {}, currentGroup: {}, currentUserGroups: {...state.currentUserGroups}};
            newState.currentGroup = action.group;
            return newState;
        case UPDATE_GROUP:
            const updateGroupState = {...state, allGroups: {...state.allGroups}, currentGroup: {...state.currentGroup}, currentUserGroups: {...state.currentUserGroups}}
            updateGroupState.currentGroup = action.group;
            return updateGroupState;
        case DELETE_GROUP:
            const deletedState = {...state, allGroups: {...state.allGroups}, currentGroup: {...state.currentGroup}, currentUserGroups: {...state.currentUserGroups}};
            delete deletedState.allGroups[action.groupId];
            return deletedState;
        case CREATE_GROUP_IMAGE:
            const preCreateState = {...state, allGroups: {}, currentGroup: {}, currentGroup: {...state.currentUserGroups}};
            preCreateState.currentGroup = action.group;
            preCreateState.currentGroup.GroupImages[0] = action.image;
            return preCreateState;
        case GET_CURRENT_USER_GROUPS:
            const currState = {...state, allGroups: {...state.allGroups}, currentGroup: {...state.currentGroup}, currentUserGroups: {}}
            action.groups.Groups.forEach(group => {
                currState.currentUserGroups[group.id] = group;
            });
            return currState;
        default:
            return state;
    }
}

export default groupsReducer;
