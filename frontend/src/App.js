import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import ReadupIndex from "./components/ReadupIndex";
import GroupsIndex from "./components/GroupsIndex";
import GroupDetailsIndex from "./components/GroupDetailsIndex";
import CreateGroupForm from "./components/CreateGroupForm";

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
            <Route path="/groups/new">
              <CreateGroupForm />
            </Route>
            <Route path="/groups/:groupId">
              <GroupDetailsIndex />
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
