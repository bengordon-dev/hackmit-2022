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
  const [graphData, setGraphData] = useState({maxVal: 2.4, list: [
    [{from: "home", to: "store", carbon: 2.4, runSum: 0}], [], [], [], [], [], []]
  })
  const [hoverBar, setHoverBar] = useState({day: -1, boxIndex: -1})

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
    let weekSum = 0;
    for (const day of data) {
      const result = [];
      let daySum = 0;
      for (let i = 1; i < day.length; i++) {
        const res = await fetch(`http://localhost:3001/driving?origin=${day[i - 1].location}&destination=${day[i].location}`);
        const json = await res.json();
        result.push({from: day[i - 1].location, to: day[i].location, carbon: json, runSum: daySum});
        daySum += json;

      }
      max = Math.max(max, daySum);
      weekSum += daySum;
      results.push(result);
    }
    setGraphData({maxVal: max, list: results})
    setFootprint(weekSum)
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
      <h3>Weekly Carbon Footprint: {footprint} kg</h3>
      {graphData.maxVal > 0 && <svg version="1.1" height="500" width="700" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="100%" height="100%" style={{fill: "#ddd"}}></rect>
        <text x="50%" y="20" dominantBaseline="middle" style={{fontSize: 20, fontWeight: "bold"}} textAnchor="middle">Emissions by day</text>
        {weekDays.map((day, i) => <text y="485" x={`${3 + i*14.28}%`}>{day}</text>)}
        {graphData.list.map((day, i) => <g>
          {day.map((l, j) => <rect 
            className="graphBar" fill="blue" width="11%" stroke="#009" 
            strokeWidth={2} y={460 - (l.runSum + l.carbon)/graphData.maxVal*425} 
            x={`${1.5+ i*14.28}%`} height={l.carbon/graphData.maxVal*425}
            onMouseEnter={() => setHoverBar({day: i, boxIndex: j})}
            onMouseLeave={() => setHoverBar({day: -1, boxIndex: -1})}>
          </rect>)}
        </g>)}
        {hoverBar.day >= 0 && hoverBar.boxIndex >= 0 && <g><rect 
          x={20} y={30} width={200} fill={"#ccc"} height={50}>
          </rect>
          <text x={20} y={45}>
            From {graphData.list[hoverBar.day][hoverBar.boxIndex].from}
          </text>
          <text x={20} y={60} width={200}>
            to {graphData.list[hoverBar.day][hoverBar.boxIndex].to}
          </text>
          <text x={20} y={75} width={200}>
            {graphData.list[hoverBar.day][hoverBar.boxIndex].carbon} kg
          </text>
        </g>}
      </svg>}
    </div>
  );
}

export default App;
