import "./App.css";
import { useState } from "react";
import ICalParser from "ical-js-parser";
import { fakeData } from "./data/fakeData.js";


const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function App() {
  const [data, setData] = useState([[], [], [], [], [], [], []]);
  const [homeAddressInput, setHomeAddressInput] = useState("")
  const [homeAddress, setHomeAddress] = useState("")
  const [footprint, setFootprint] = useState(0)

  function handleFakeData() {
    const newData = [[], [], [], [], [], [], []];
    for (const event of fakeData) {
      const weekDay = new Date(event.startDate).getDay();
      event.selected = false
      newData[weekDay].push(event);
    }
    for (let i = 0; i < 7; i++) {
      newData[i].sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    }
    setData(newData);
  }

  async function getDistance(origin, destination) {
    // var restRequest = gapi.client.request({
    //   'path': 'https://maps.googleapis.com/maps/api/directions/json',
    //   'params': {'origin': encodeURIComponent(origin), 'destination': encodeURIComponent(destination)}
    // });
    // console.log(restRequest);
  }

  function select(weekDay, i) {
    let newDay = data[weekDay]
    newDay[i].selected = !newDay[i].selected
    setData([...data.slice(0, weekDay), newDay, ...data.slice(weekDay + 1)])
  }

  function filterSelected() {
    let newData = [...data]
    for (let i = 0; i < newData.length; i++) {
      newData[i] = newData[i].filter((e) => e.selected)
    }
    setData(newData)
  }

  async function getFootprint() {
    const results = [];
    let max = 0;
    for (const day of data) {
      const result = [];
      for (let i = 1; i < day.length; i++) {
        const res = await fetch(`http://localhost:3001/driving?origin=${day[i - 1].location}&destination=${day[i].location}`);
        const json = await res.json();
        max = Math.max(max, json);
        result.push({from: day[i - 1].location, to: day[i].location, carbon: json});
      }
      results.push(result);
    }
    console.log(results);
  }

  return (
    <div className="App">
      <div style={{marginTop: "1em"}}>
        <button style={{marginRight: "0.5em"}} onClick={() => handleFakeData()}>Import calendar</button>
        <button style={{marginLeft: "0.5em"}} onClick={() => filterSelected()}>Filter Unselected Events</button>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {weekDays &&
          weekDays.map((day, i) => (
            <div style={{ width: "20%", paddingLeft: 5, paddingRight: 5 }}>
              <h3>{day}</h3>
              {data[i] &&
                data[i].map((event, key) => (
                  <p className={`eventButton ${event.selected ? "selected" : "notSelected"}`}
                     onClick={() => select(i, key)}
                  >
                    {event.summary}
                    <br />
                    {new Date(event.startDate).toTimeString().substring(0, 5)}-
                    {new Date(event.endDate).toTimeString().substring(0, 5)}
                    <br />
                    {event.location}
                  </p>
                ))}
            </div>
          ))}
      </div>
      <hr/>

      <div style={{marginTop: "1em"}}>
        <input style={{marginRight: "0.5em"}} value={homeAddressInput} onChange={(e) => setHomeAddressInput(e.target.value)}/>
        <button style={{marginLeft: "0.5em"}} onClick={() => {setHomeAddress(homeAddressInput); setHomeAddressInput("")}}>Submit Home Address</button>
      </div>
      <h3>{homeAddress && `Home Address: ${homeAddress}`}</h3>

      <button onClick={() => getFootprint()}>Get carbon footprint</button>
      <h3>Carbon Footprint: {footprint} kg</h3>
    </div>
  );
}

export default App;
