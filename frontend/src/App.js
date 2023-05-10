import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import ReadupIndex from "./components/ReadupIndex";
import GroupsIndex from "./components/GroupsIndex";
import GroupDetailsIndex from "./components/GroupDetailsIndex";
import CreateGroupForm from "./components/CreateGroupForm";
import EventsIndex from "./components/EventsIndex";
import UpdateGroupForm from "./components/UpdateGroupForm";
import EventDetailsIndex from "./components/EventDetailsIndex";
import CreateEventForm from"./components/CreateEventForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);



  return (
    <>

      <Navigation isLoaded={isLoaded} />
      {
        isLoaded && (
          <Switch>
            <Route exact path="/groups/new">
              <CreateGroupForm />
            </Route>
            {/* <Route path="/groups/:groupId/events/new">
              <CreateEventForm />
            </Route> */}
            <Route path="/groups/:groupId/edit">
              <UpdateGroupForm />
            </Route>
            <Route path="/groups/:groupId">
              <GroupDetailsIndex />
            </Route>
            <Route path="/events/:eventId">
              <EventDetailsIndex />
            </Route>
            <Route path="/events">
              <EventsIndex />
            </Route>
            <Route path="/groups">
              <GroupsIndex />
            </Route>
            <Route exact path="/">
              <ReadupIndex />
            </Route>
          </Switch>
        )
      }
    </>
  );
}

export default App;
