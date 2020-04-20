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

export { fetchData, convertToLocalTime };
export default App;
