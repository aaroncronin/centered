import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./Homepage.js";
import { data } from "./data.json";

function App() {
  const [data2, setData2] = useState(data);

  const gapi = window.gapi;
  const CLIENT_ID =
    "1000504246865-dlbsovfdskfsjh4a5bch6ahe49ss750e.apps.googleusercontent.com";
  const API_KEY = "AIzaSyAQvucQ_RFtH8yWLZzN2LWZW1sYquD-tNE";
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  const handleClick = () => {
    gapi.load("client:auth2", () => {
      console.log("loaded");

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load("calendar", "v3", () => console.log("cal"));

      gapi.auth2.getAuthInstance().signIn();
    });
  };

  const handleChange = (event) => {
    let newData = data.filter((ele) =>
      ele.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    if (event.target.value === "") {
      newData = data;
    }
    setData2(newData);
  };

  return (
    <div>
      <div id="topHeader">
        <span id="siteName">Centered</span>
        <div id="rightBar">
          <span>Login</span>
          <span>Sign Up</span>
          <span id="rightButton">Admin Panel</span>
          <span id="rightButton">Create Event</span>
        </div>
      </div>
      <Router>
        <Route
          path="/"
          render={(props) => (
            <Homepage
              data={data2}
              handleClick={handleClick}
              handleChange={handleChange}
              {...props}
            />
          )}
        />
      </Router>
    </div>
  );
}

export default App;
