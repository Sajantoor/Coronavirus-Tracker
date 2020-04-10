import React from 'react';
import './App.css';
import GoogleMap from './components/Map';
// eslint-disable-next-line
import database from './Firebase';

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

export { fetchData };
export default App;
