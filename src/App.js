import React from 'react';
import './App.css';
import GoogleMap from './components/Map';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <GoogleMap/>
      </div>
    )
  }
}

async function fetchData(url) {
  let response = await fetch(url);
  let data = await response.json()
  return data;
}


export { fetchData };
export default App;
