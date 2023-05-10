import { csrfFetch } from "./csrf";

//action variables here

const GET_GROUP_EVENTS = "events/getGroupEvents";
const GET_EVENT = "events/getEvent";
const GET_EVENTS = "events/getEvents";
const CREATE_EVENT = "events/createEvent";

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

export const createEventThunk = event => async dispatch => {
    const res = await csrfFetch(`/api/events`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    })
    if (res.ok) {
        const newEvent = await res.json();
        await dispatch(getEventAction(newEvent))
        return newEvent;
    } else {
        const err = await res.json();
        return err;
    }
}


//reducer here

const initialState = {allEvents: {}, currentEvent: {}, currentGroupEvents: {}};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EVENTS:
            const eventsState = {...state, allEvents: {}, currentEvent: {}, currentGroupEvents: {}};
            action.events.Events.forEach(event => {
                eventsState.allEvents[event.id] = event;
            })
            return eventsState;
        case GET_GROUP_EVENTS:
            const eventState = {...state, allEvents: {}, currentEvent: {}, currentGroupEvents: {}};
            action.events.Events.forEach(event => {
                eventState.currentGroupEvents[event.id] = event;
            })
            return eventState;
        case GET_EVENT:
            const newState = {...state, allEvents: {}, currentEvent: {}, currentGroupEvents: {}}
            newState.currentEvent = action.event;
            return newState;
        default:
        return state;
    }
}

export default eventsReducer;
