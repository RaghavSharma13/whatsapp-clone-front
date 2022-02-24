import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import { useDispatch, useSelector } from "react-redux";
import { checkUser } from "./store/actions/userActions";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        dispatch(checkUser());
      } catch (e) {}
    };
    getUser();
  }, [dispatch]);

  const user = useSelector((root) => root.userReducer.user);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar />
            <Switch>
              <Route path="/rooms/:category/:roomId" component={Chat} />
              <Route path="/"></Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
