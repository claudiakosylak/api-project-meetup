
//action variables here

const GET_GROUPS = "groups/getGroups";

//actions here

const getGroupsAction = groups => ({
    type: GET_GROUPS,
    groups
})


// thunks here



// reducer here


const initialState = {};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GROUPS:
            const groupsState = { ...state };
            action.groups.forEach(group => {
                groupsState[group.id] = group;
            });
            return groupsState;
        default:
            return state;
    }
}

export default groupsReducer;
