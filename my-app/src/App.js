import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./components/Homepage";
import { data } from "./data.json";

const App = () => {
  const [data2, setData2] = useState(data);
  const [showLogIn, setShowLogIn] = useState("noShowLogin");
  const [dataExists, setDataExists] = useState(true);

  const gapi = window.gapi;
  const CLIENT_ID =
    "1000504246865-4qpvq06s551mt213nug8qj1764nehiod.apps.googleusercontent.com";
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

  const dateSet = (value) => {
    const dateAsArray = value.toString().split(" ");

    const dateString = `${dateAsArray[1]} ${dateAsArray[2]}`;
    let filteredData = data.filter(
      (ele) =>
        dateString ===
        `${ele.startTimeFinal.split(" ")[1]} ${
          ele.startTimeFinal.split(" ")[2]
        }`
    );

    filteredData.length === 0 ? setDataExists(false) : setDataExists(true);

    setData2(filteredData);
  };

  const toggleLogIn = (event) => {
    if (showLogIn === "noShowLogin") {
      setShowLogIn("showLogin");
    } else {
      setShowLogIn("noShowLogin");
    }
  };

  return (
    <div>
      <div id="topHeader">
        <span id="siteName">Centered</span>
        <div id="rightBar">
          <span onClick={toggleLogIn}>Login</span>
          <span>Sign Up</span>
          <span id="rightButton">Admin Panel</span>
          <span id="rightButton">Create Event</span>
        </div>
      </div>
      <div className={showLogIn}>Name:</div>

      <Router>
        <Route
          path="/"
          render={(props) => (
            <Homepage
              dataExists={dataExists}
              data={data2}
              handleClick={handleClick}
              handleChange={handleChange}
              dateSet={dateSet}
              {...props}
            />
          )}
        />
      </Router>
    </div>
  );
};

export default App;
