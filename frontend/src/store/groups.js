import { csrfFetch } from "./csrf";
//action variables here

const GET_GROUPS = "groups/getGroups";
const GET_GROUP = "groups/getGroup";
const UPDATE_GROUP = "groups/updateGroup";
const DELETE_GROUP = "groups/deleteGroup";

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

// thunks here

export const getGroupsThunk = () => async (dispatch) => {
    const res = await fetch("/api/groups");
    const allGroups = await res.json();
    if (res.ok) {
        await dispatch(getGroupsAction(allGroups))
    }
}

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

export const createGroupThunk = (group) => async dispatch => {
    try {
        const res = await csrfFetch("/api/groups", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(group)
        })

        if (res.ok) {
            const newGroup = await res.json();
            console.log("THIS IS RESPONSE OK FROM THUNK: ", newGroup)
            await dispatch(getGroupAction(newGroup))
            return newGroup;
        }

    } catch(err) {
        console.log("THIS IS THE CATCH ERR: ", err)
    }
    // else {
    //     const err = await res.json();
    //     console.log("THIS IS THE ERROR FROM THUNK: ", err)
    //     console.log(err)
    //     return err;
    // }
}

export const updateGroupThunk = (groupId, group) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
    })
    if (res.ok) {
        const updatedGroup = await res.json();
        // console.log("OK RESPONSE FROM THUNK: ", updatedGroup)
        dispatch(updateGroupAction(updatedGroup))
        return updatedGroup;
    } else {
        const err = await res.json()
        // console.log("ERROR FROM THUNK: ", err)
        return err;
    }
}

export const deleteGroupThunk = groupId => async dispatch => {
    console.log("THE GROUPID IN THUNK: ", groupId)
    const res = await csrfFetch(`/api/groups/${groupId}`, {method: "DELETE"})
    if (res.ok) {
        const successMessage = await res.json();
        dispatch(deleteGroupAction(groupId))
        console.log("SUCCESS MESSAGE: ", successMessage)
        return successMessage;
    } else {
        const err = await res.json();
        console.log("BAD MESSAGE: ", err)
        return err;
    }
}
// reducer here


const initialState = {allGroups: {}, currentGroup: {}};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GROUPS:
            const groupsState = { ...state };
            action.groups.Groups.forEach(group => {
                groupsState.allGroups[group.id] = group;
            });
            return groupsState;
        case GET_GROUP:
            const newState = {...state};
            newState.currentGroup = action.group;
            return newState;
        case UPDATE_GROUP:
            const updateGroupState = {...state}
            updateGroupState.currentGroup = action.group;
            return updateGroupState;
        case DELETE_GROUP:
            const deletedState = {...state};
            delete deletedState.allGroups[action.groupId];
            return deletedState;
        default:
            return state;
    }
}

export default groupsReducer;
