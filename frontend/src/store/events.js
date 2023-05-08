//action variables here

const GET_GROUP_EVENTS = "groups/getGroupEvents";

//actions here

export const getGroupEventsAction = events => ({
    type: GET_GROUP_EVENTS,
    events
})


export const getGroupEventsThunk = (groupId) => async dispatch => {
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
        const eventState = {...state};
        action.events.Events.forEach(event => {
            eventState[event.id] = event;
        })
        return eventState;
    }
}

export default eventsReducer;
