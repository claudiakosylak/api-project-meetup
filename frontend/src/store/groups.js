
//action variables here

const GET_GROUPS = "groups/getGroups";

//actions here

const getGroupsAction = groups => ({
    type: GET_GROUPS,
    groups
})


// thunks here

export const getGroupsThunk = () => async (dispatch) => {
    const res = await fetch("/api/groups");
    const allGroups = await res.json();
    if (res.ok) {
        dispatch(getGroupsAction(allGroups))
    }
}


// reducer here


const initialState = {};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GROUPS:
            const groupsState = { ...state };
            console.log("ACTION GROUPS IN REDUCER: ", action.groups)
            action.groups.forEach(group => {
                console.log("THIS IS GROUP IN FOREACH: ", group)
                groupsState[group.id] = group;
            });
            return groupsState;
        default:
            return state;
    }
}

export default groupsReducer;
