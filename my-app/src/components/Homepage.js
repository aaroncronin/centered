import React, { useState } from "react";
import Calendar from "react-calendar";
import DatePicker from "react-date-picker";

const Homepage = (props) => {
  const [value, onChange] = useState(new Date());

  const twoChangeCalls = (e) => {
    onChange(e);
    props.dateSet(e);
  };

  return (
    <div>
      <div className="header">
        Online Events For Improving Your Mental State
        <br></br>
        <input
          className="eventSearch"
          type="text"
          placeholder="Search for events..."
          onChange={(e) => props.handleChange(e)}
        ></input>
        <DatePicker
          className="calendar"
          onChange={twoChangeCalls}
          value={value}
          clearIcon={null}
        />
      </div>
      <div className="divTable">
        {!props.dataExists ? <div>HELLLOOOO</div> : <div></div>}

        <table>
          <tbody>
            {props.data.map((d) => (
              <tr>
                <td>
                  <img src={d.image}></img>
                </td>
                {/* <td>
                  <div id="name">{d.name}</div>
                  <br></br>
                  {d.studio}
                </td> */}
                {/* <td>{d.studio}</td>
              <td>{d.address}</td>
              <td>{d.phone}</td> */}
                <td>{d.startTimeFinal}</td>
                <td>{d.endTimeFinal}</td>
                <td>
                  <div
                    id="bookNow"
                    onClick={() => window.open(d.link, "_blank")}
                  >
                    Read More
                  </div>
                  <div id="bookNow" onClick={() => props.handleClick()}>
                    Book Now
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homepage;
