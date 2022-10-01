const IcalExpander = require('ical-expander');
const fs = require('fs');

function getData() {
  const ics = fs.readFileSync('./bengordon.ics', 'utf-8');

  const icalExpander = new IcalExpander({ ics, maxIterations: 100 });
  const events = icalExpander.between(new Date('2022-10-02T00:00:00.000Z'), new Date('2022-10-08T00:00:00.000Z'));

  const mappedEvents = events.events.map(e => ({startDate: e.startDate.toJSDate().toISOString(), endDate: e.endDate.toJSDate().toISOString(), summary: e.summary, location: e.location }));
  const mappedOccurrences = events.occurrences.map(o => ({startDate: o.startDate.toJSDate().toISOString(), endDate: o.endDate.toJSDate().toISOString(), summary: o.item.summary, location: o.item.location  }));
  const allEvents = [].concat(mappedEvents, mappedOccurrences);
  //console.log(allEvents)
  for (const event of allEvents) {
    if (event && event.location && event.location.includes("Zoom")) {
      event.location = "Zoom"
    }
  }
  return allEvents
}

console.log(getData())
/*async function getDistance(origin, destination) {
  return await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=AIzaSyAqVW6CPCYCjdopi_-_fY6890wgOPhYaWI`);
}

console.log(getData())

const res = await getDistance('gates dell complex', 'j2 dining');
console.log(res.data);

module.exports = {getData, getDistance};*/