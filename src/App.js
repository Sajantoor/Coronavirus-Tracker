import React from 'react';
import './App.css';
import GoogleMap from './components/Map';

function App() {
  return (
    <div className="App">



    </div>
  );
}

async function fetchData(url) {
  let response = await fetch(url);
  let data = await response.json()
  return data;
}


export { fetchData };
export default App;
