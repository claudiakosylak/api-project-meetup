//action variables here

const GET_GROUP_EVENTS = "groups/getGroupEvents";

//actions here

export const getGroupEventsAction = events => ({
    type: GET_GROUP_EVENTS,
    events
})


export const getGroupEventsThunk = (groupId) => async dispatch => {
    console.log("THE GROUPID IN THUNK: ", groupId)
    const res = await fetch(`/api/groups/${groupId}/events`);
    if (res.ok) {
        const events = await res.json();
        await dispatch(getGroupEventsAction(events))
        return events;
    } else {
        const error = await res.json();
        return error;
    }
}

const initialState = {};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GROUP_EVENTS:
            console.log("ACTION EVENTS IN REDUCER: ", action.events)
            const eventState = { };
            action.events.Events.forEach(event => {
                eventState[event.id] = event;
            })
            return eventState;
        default:
        return state;
    }
}

export default eventsReducer;
