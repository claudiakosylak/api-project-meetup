import { csrfFetch } from "./csrf";

//action variables here
export const SET_SESSION_USER = "session/setSessionUser";
export const REMOVE_SESSION_USER = "session/removeSessionUser";

//actions here

export const setSessionUserAction = user => ({
    type: SET_SESSION_USER,
    user
})

export const removeSessionUserAction = () => ({
    type: REMOVE_SESSION_USER,
    user: null
})

//thunks here

export const setSessionUserThunk = (login) => async dispatch => {
    const res = await csrfFetch("/api/session", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(login)
    })

    if (res.ok) {
        const user = await res.json();
        await dispatch(setSessionUserAction(user))
        return user;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const removeSessionUserThunk = () => async dispatch => {
    const res = await fetch("/api/session", {
        method: "DELETE"
    })

    if (res.ok) {
        const okayMessage = await res.json();
        await dispatch(removeSessionUserAction())
        return okayMessage;
    } else {
        const errors = await res.json();
        return errors;
    }
}


const sessionReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_SESSION_USER:
            const newState = {...state}
            newState.user = action.user
            return newState;
        case REMOVE_SESSION_USER:
            const newerState = {...state}
            newerState.user = action.user
            return newerState;
        default:
            return state;
    }
};

export default sessionReducer;
