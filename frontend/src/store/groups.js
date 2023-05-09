import { csrfFetch } from "./csrf";
//action variables here

const GET_GROUPS = "groups/getGroups";
const GET_GROUP = "groups/getGroup";

//actions here

export const getGroupsAction = groups => ({
    type: GET_GROUPS,
    groups
})

export const getGroupAction = group => ({
    type: GET_GROUP,
    group
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
    const res = await csrfFetch("/api/groups", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
    })

    if (res.ok) {
        const newGroup = await res.json();
        await dispatch(getGroupAction(newGroup))
        return newGroup;
    } else {
        const err = await res.json();
        console.log(err)
        return err;
    }
}


// reducer here


const initialState = {};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GROUPS:
            const groupsState = { ...state };
            action.groups.Groups.forEach(group => {
                groupsState[group.id] = group;
            });
            return groupsState;
        case GET_GROUP:
            const newState = {...state};
            newState[action.group.id] = action.group;
            return newState;
        default:
            return state;
    }
}

export default groupsReducer;
