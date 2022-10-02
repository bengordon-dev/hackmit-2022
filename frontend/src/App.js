import "./App.css";
import { useState, useEffect } from "react";
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
  const useScript = (url) => {
    useEffect(() => {
      const script = document.createElement("script");

      script.src = url;
      script.async = true;

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }, [url]);
  };
  useScript("https://apis.google.com/js/api.js");

  const [fileString, setFileString] = useState("");
  const [data, setData] = useState([[], [], [], [], [], [], []]);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const handleSubmission = () => {
    const fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
      let textFromFileLoaded = fileLoadedEvent.target.result;
      setFileString(textFromFileLoaded);
    };
    fileReader.readAsText(selectedFile);
  };

  function getData() {
    if (fileString) {
      const resultJSON = ICalParser.toJSON(fileString);
      //const icalExpander = new IcalExpander({ fileString, maxIterations: 100 })
      console.log(resultJSON.events);
      const ev = resultJSON.events;
      for (const event of ev) {
        console.log(new Date(event.dtstart.toJSDate()));
      }
      setData(resultJSON.events);
      console.log(data.slice(-2));
    }
  }

  function handleFakeData() {
    const newData = [[], [], [], [], [], [], []];
    for (const event of fakeData) {
      const weekDay = new Date(event.startDate).getDay();
      newData[weekDay].push(event);
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

  return (
    <div className="App">
      <button onClick={() => handleFakeData()}>Import calendar</button>

      <div style={{ display: "flex", flexDirection: "row" }}>
        {weekDays &&
          weekDays.map((day, i) => (
            <div style={{ width: "20%" }}>
              <h3>{day}</h3>
              {data[i] &&
                data[i].map((event, key) => (
                  <p>
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
    </div>
  );
}

export default App;
