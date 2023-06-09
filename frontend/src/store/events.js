import { csrfFetch } from "./csrf";

//action variables here

const GET_GROUP_EVENTS = "events/getGroupEvents";
const GET_EVENT = "events/getEvent";
const GET_EVENTS = "events/getEvents";
const CREATE_EVENT_IMAGE = "events/createEventImage";
const DELETE_EVENT = "events/deleteEvent";

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

export const createEventImageAction = (event, image) => ({
    type: CREATE_EVENT_IMAGE,
    event,
    image
})

export const deleteEventAction = eventId => ({
    type: DELETE_EVENT,
    eventId
})

//thunks here
export const getEventsThunk = (page) => async (dispatch) => {
    const res = await fetch(`/api/events?page=${page}`);
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

export const createEventThunk = (event, groupId, image) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    })
    if (res.ok) {
        const newEvent = await res.json();
        await dispatch(getEventAction(newEvent))
        await dispatch(createEventImageThunk(newEvent, image))
        return newEvent;
    } else {
        const err = await res.json();
        return err;
    }
}

export const createEventImageThunk = (event, image) => async dispatch => {
    const res = await csrfFetch(`/api/events/${event.id}/images`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image)
    })
    if (res.ok) {
        const newImage = await res.json();
        await dispatch(getEventAction(event))
        return newImage;
    } else {
        const err = await res.json();
        return err;
    }
}

export const deleteEventThunk = eventId => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}`, {method: "DELETE"})
    if (res.ok) {
        const successMessage = await res.json();
        dispatch(deleteEventAction(eventId))
        return successMessage;
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
            const newState = {...state, allEvents: {}, currentEvent: {}, currentGroupEvents: {}};
            newState.currentEvent = action.event;
            return newState;
        case CREATE_EVENT_IMAGE:
            const preCreateState = {...state, allEvents: {}, currentEvent: {}, currentGroupEvents: {}};
            preCreateState.currentEvent = action.event;
            preCreateState.currentEvent.EventImages[0] = action.image;
            return preCreateState;
        case DELETE_EVENT:
            const deletedState = {...state, allEvents: {...state.allEvents}, currentEvent: {...state.currentEvent}, currentGroupEvents: {...state.currentGroupEvents} }
            delete deletedState.allEvents[action.eventId];
            delete deletedState.currentGroupEvents[action.eventId];
            return deletedState;
            default:
        return state;
    }
}

export default eventsReducer;
