//action variables here

const GET_GROUP_EVENTS = "events/getGroupEvents";
const GET_EVENT = "events/getEvent";
const GET_EVENTS = "events/getEvents";

//actions here
export const getEventsAction = events => ({
    type: GET_EVENTS,
    events
})

export const getGroupEventsAction = events => ({
    type: GET_GROUP_EVENTS,
    events
})

export const getEventAction = event => ({
    type: GET_EVENT,
    event
})

//thunks here
export const getEventsThunk = () => async (dispatch) => {
    const res = await fetch("/api/events");
    if (res.ok) {
        const allEvents = await res.json();
        console.log("EVENTS IN THUNK", allEvents)
        await dispatch(getEventsAction(allEvents))
    }
}

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

export const getEventThunk = (eventId) => async dispatch => {
    const res = await fetch(`/api/events/${eventId}`);
    if (res.ok) {
        const event = await res.json();
        await dispatch(getEventAction(event))
        return event;
    } else {
        const error = await res.json();
        return error;
    }
}

const initialState = {allEvents: {}, currentEvent: {}};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EVENTS:
            const eventsState = {...state};
            action.events.Events.forEach(event => {
                eventsState.allEvents[event.id] = event;
            })
            return eventsState;
        case GET_GROUP_EVENTS:
            const eventState = {...state };
            action.events.Events.forEach(event => {
                eventState.allEvents[event.id] = event;
            })
            return eventState;
        case GET_EVENT:
            const newState = {...state}
            newState.currentEvent = action.event;
            return newState;
        default:
        return state;
    }
}

export default eventsReducer;
