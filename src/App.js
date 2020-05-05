import React from 'react';
import './App.css';
import GoogleMap from './components/Map';

function App() {
  return (
    <div className="App">
      <GoogleMap/>
    </div>
  );
}

// fetch data async function used in google map component
async function fetchData(url) {
  let response = await fetch(url);
  let data = await response.json()
  return data;
}

// converts the ISO 8601 timezone value from the data to the user's local time zone value
function convertToLocalTime(value) {
  let date = new Date(value);
  return date.toLocaleString();
}


async function getData() {
  const data = {
    latest: {},
    locations: [],
  };
  
  // sources
  const COVID19API_WORLD = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=true";
  const COVID19API_US = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs&timelines=true";
  // fetch world data and push to data object
  fetchData(COVID19API_WORLD).then(worldData => {
    // pushes to main data object
    for (var i = 0; i < worldData.locations.length; i++) {
      let obj = worldData.locations[i];
      obj.coordinates.latitude = parseFloat(obj.coordinates.latitude);
      obj.coordinates.longitude = parseFloat(obj.coordinates.longitude);
      // removes all US data as US has it's own source and removes NULL island
      if (obj.country !== "US" && obj.province !== "Grand Princess" && !(obj.coordinates.latitude === 0 && obj.coordinates.longitude === 0)) {
        obj.last_updated = convertToLocalTime(obj.last_updated);
        data.locations.push(obj);
      }
    }

    data.latest = worldData.latest;
  });
  // fetches us data and push to data object
  fetchData(COVID19API_US).then(USData => {
    for (var i = 0; i < USData.locations.length; i++) {
      USData.locations[i].last_updated = convertToLocalTime(USData.locations[i].last_updated);
      USData.locations[i].coordinates.latitude = parseFloat(USData.locations[i].coordinates.latitude);
      USData.locations[i].coordinates.longitude = parseFloat(USData.locations[i].coordinates.longitude);
      data.locations.push(USData.locations[i]);
    }
  });

  return data;
}

getData();


export { getData, convertToLocalTime };
export default App;
