const IcalExpander = require('ical-expander');
const fs = require('fs');

function getData() {
  const ics = fs.readFileSync('./bengordon.ics', 'utf-8');

  const icalExpander = new IcalExpander({ ics, maxIterations: 100 });
  const events = icalExpander.between(new Date('2022-10-02T00:00:00.000Z'), new Date('2022-10-08T00:00:00.000Z'));
  console.log(events)
  const mappedEvents = events.events.map(e => ({startDate: e.startDate.toJSDate(), endDate: e.endDate.toJSDate(), summary: e.summary, location: e.location }));
  const mappedOccurrences = events.occurrences.map(o => ({startDate: o.startDate.toJSDate(), endDate: o.endDate.toJSDate(), summary: o.item.summary, location: o.item.location  }));
  const allEvents = [].concat(mappedEvents, mappedOccurrences);
  //console.log(allEvents)
  for (const event of allEvents) {
    if (event && event.location && event.location.includes("Zoom")) {
      event.location = "Zoom"
    }
  }
  return allEvents
}

exports.getData = getData