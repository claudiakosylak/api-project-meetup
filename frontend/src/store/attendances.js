import { csrfFetch } from "./csrf";

// action variables here

const GET_EVENT_ATTENDEES = "events/getEventAttendees";

// actions here

export const getEventAttendeesAction = attendees => ({
    type: GET_EVENT_ATTENDEES,
    attendees
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


// reducer here

const initialState = {attendees: {}};

const attendanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EVENT_ATTENDEES:
            const newState = {...state, attendees: {}}
            action.attendees.Attendees.forEach(attendee => {
                newState.attendees[attendee.id] = attendee;
            })
            return newState;
        default:
            return state;
    }
}

export default attendanceReducer;
