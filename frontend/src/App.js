import './App.css';
import {useState, useEffect} from "react";
import ICalParser from 'ical-js-parser';
//import IcalExpander from 'ical-expander';
import {fakeData} from "./data/fakeData.js"

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function App() {
  const useScript = url => {
    useEffect(() => {
      const script = document.createElement('script');

      script.src = url;
      script.async = true;

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      }
    }, [url]);
  };
  useScript('https://apis.google.com/js/api.js');
  // getDistance('gates dell complex', 'j2 dining');

  const [fileString, setFileString] = useState("")
  const [data, setData] = useState([[], [], [], [], [], [], []])
  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [isSelected, setIsSelected] = useState(false)

  const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
    //console.log(selectedFile)
		setIsSelected(true);
	};

  const handleSubmission = () => {

    const fileReader = new FileReader()
    fileReader.onload = function(fileLoadedEvent){
      let textFromFileLoaded = fileLoadedEvent.target.result;
      //console.log(ical.parseICS(textFromFileLoaded))
      //textFromFileLoaded && getData(textFromFileLoaded)
      setFileString(textFromFileLoaded)
      //const icalExpander = new IcalExpander({ textFromFileLoaded, maxIterations: 100 });
    };
    fileReader.readAsText(selectedFile);
	};

  function getData() { 
    if (fileString) {
      const resultJSON = ICalParser.toJSON(fileString);
      //const icalExpander = new IcalExpander({ fileString, maxIterations: 100 })
      console.log(resultJSON.events)
      const ev = resultJSON.events
      for (const event of ev) {
        console.log(new Date(event.dtstart.toJSDate()))
      }
      setData(resultJSON.events)
      console.log(data.slice(-2))
      /*const icalExpander = new IcalExpander({ fileString, maxIterations: 100 });
      const events = icalExpander.between(new Date('2022-10-02T00:00:00.000Z'), new Date('2022-10-08T00:00:00.000Z'));
      const mappedEvents = events.events.map(e => ({startDate: e.startDate.toJSDate(), endDate: e.endDate.toJSDate(), summary: e.summary, location: e.location }));
      const mappedOccurrences = events.occurrences.map(o => ({startDate: o.startDate.toJSDate(), endDate: o.endDate.toJSDate(), summary: o.item.summary, location: o.item.location  }));
      const allEvents = [].concat(mappedEvents, mappedOccurrences);
      //console.log(allEvents)
      for (const event of allEvents) {
        if (event && event.location && event.location.includes("Zoom")) {
          event.location = "Zoom"
        }
      }
      setData(allEvents)*/
    }
      
  }

  function handleFakeData() {
    const newData = [[], [], [], [], [], [], []]
    for (const event of fakeData) {
      const weekDay = new Date(event.startDate).getDay()
      newData[weekDay].push(event)
    }
    setData(newData)
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
      {/*<div>
        <input type="file" name="file" onChange={changeHandler} />
        {isSelected ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            <p>Size in bytes: {selectedFile.size}</p>
            <p>
              lastModifiedDate:{' '}
              {selectedFile.lastModifiedDate.toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
        <div>
          <button onClick={() => handleSubmission()}>Submit</button>
        </div>
      </div>*/}
      
      
      {/*fileString && <button onClick={() => getData()}>calendar</button>*/}
      
      <button onClick={() => handleFakeData()}>Import calendar</button>

      <div style={{display: "flex", flexDirection: "row"}}>
      {weekDays && weekDays.map((day, i) => 
        <div style={{width: "20%"}}>
          <h3>{day}</h3>
          {data[i] && data[i].map((event, key) => <p>{event.summary}<br/> {new Date(event.startDate).getHours()}:{new Date(event.startDate).getMinutes()} - {new Date(event.endDate).getHours()}:{new Date(event.endDate).getMinutes()} <br/>{event.location}</p>)}
        </div>
      )}
      </div>

      
    </div>
  );
}

export default App;
