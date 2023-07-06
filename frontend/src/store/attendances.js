import { csrfFetch } from "./csrf";

// action variables here

const GET_EVENT_ATTENDEES = "events/getEventAttendees";
const GET_ATTENDED_EVENTS = "events/getAttendedEvents";

// actions here

export const getEventAttendeesAction = attendees => ({
    type: GET_EVENT_ATTENDEES,
    attendees
})

export const getAttendedEventsAction = events => ({
    type: GET_ATTENDED_EVENTS,
    events
})


// thunks here

// this gets all attendees for a an event by event id
export const getEventAttendeesThunk = eventId => async dispatch => {
    const res = await fetch(`/api/events/${eventId}/attendees`);
    if (res.ok) {
        const attendees = await res.json();
        await dispatch(getEventAttendeesAction(attendees))
        return attendees;
    } else {
        const error = await res.json();
        return error;
    }
}

// creates an attendance / allows a user to attend an event
export const createAttendanceThunk = eventId => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}/attendance`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
        const newAttendance = await res.json();
        await dispatch(getEventAttendeesThunk(eventId))
        return newAttendance;
    }
}

// gets all the events attended by the current user
export const getAttendedEventsThunk = () => async dispatch => {
    const res = await fetch("/api/events/current")
    if (res.ok) {
        const events = await res.json();
        await dispatch(getAttendedEventsAction(events))
        return events;
    } else {
        const error = await res.json();
        return error;
    }
}


// reducer here

const initialState = {attendees: {}, attendedEvents: {}};

const attendanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EVENT_ATTENDEES:
            const newState = {...state, attendees: {}, attendedEvents: {...state.attendedEvents}}
            action.attendees.Attendees.forEach(attendee => {
                newState.attendees[attendee.id] = attendee;
            })
            return newState;
        case GET_ATTENDED_EVENTS:
            const eventState = {...state, attendees: {}, attendedEvents: {}}
            action.events.Events.forEach(event => {
                eventState.events[event.id] = event;
            })
            return eventState;
        default:
            return state;
    }
}

export default attendanceReducer;
