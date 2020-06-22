import React from "react";

const Homepage = (props) => {
  return (
    <div>
      <div className="header">
        Online Events For Improving Your Mental State
        <br></br>
        <input
          className="eventSearch"
          type="text"
          placeholder="Search for events"
          onChange={(e) => props.handleChange(e)}
        ></input>
      </div>
      <div className="divTable">
        <table>
          <tbody>
            {props.data.map((d) => (
              <tr>
                <td>
                  <img src={d.image}></img>
                </td>
                <td>
                  <div id="name">{d.name}</div>
                  <br></br>
                  {d.studio}
                </td>
                {/* <td>{d.studio}</td>
              <td>{d.address}</td>
              <td>{d.phone}</td> */}
                <td>{d.date}</td>
                <td>{d.time}</td>
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
