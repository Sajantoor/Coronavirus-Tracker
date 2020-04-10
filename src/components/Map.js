import React from 'react';
import { scatterPlotLayer, hoverPlotLayer, heatMapLayer, getInfo } from './Deck';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import mapStyles from './map-styles';
// eslint-disable-next-line
import styles from './css/map.css';
import { fetchData } from '../App';
import Loading from './Loading';

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
// data from multiple sources
let data = {
  latest: {},
  locations: [],
};

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.getLocation = this.getLocation.bind(this);
    this.resize = this.resize.bind(this);

    this.state = {
      layers: [], // which layers are being used
      worldData: false, // check if world data is fetched
      usData: false, // check if us data is fetched
      dataParameter: "confirmed", // which dataParameter is currently displayed, confirmed, deaths or recovered
      heatMap: true, // layer booleans
      scatterPlot: true,
    }
  }

  googleMapRef = React.createRef();

  componentDidMount() {
    // create the google map component and loads the script
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=visualization`;
    window.document.body.appendChild(googleMapScript);
    // initializes the map
    googleMapScript.addEventListener('load', () => {
      this.googleMap = this.createGoogleMap();
      this.getData();
      this.requestLocation();
    });
  }

  // creates the google map component
  createGoogleMap() {
    let map =  new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 2,
      minZoom: 2,
      center: {
        lat:  0,
        lng:  0,
      },
      disableDefaultUI: true,
      styles: mapStyles,
      draggableCursor: 'crosshair',
      gestureHandling: 'greedy',
    });

    window.google.maps.event.addDomListener(window, 'resize', this.resize);
    return map;
  }

  // request the location of the user
  requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getLocation);
    }
  }

  // changes the center to be the user's location to see data points close to them first
  getLocation(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    this.googleMap.setCenter({lat: lat, lng: lng});
    this.googleMap.setZoom(5);
  }

  // fetches the data from the apis
  getData() {
    // sources
    const COVID19API_WORLD = "https://coronavirus-tracker-api.herokuapp.com/v2/locations";
    const COVID19API_US = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs";
    // fetch world data and push to data object
    fetchData(COVID19API_WORLD).then(worldData => {
      // removes all US data as US has it's own source and removes NULL island
      worldData.locations = worldData.locations.filter(d => d.country !== "US" && d.province !== "Grand Princess" && (d.coordinates.latitude !== "0" && d.coordinates.longitude !== "0"));
      // pushes to main data object
      for (var i = 0; i < worldData.locations.length; i++) {
        data.locations.push(worldData.locations[i]);
      }

      data.latest = worldData.latest;
      this.setState({worldData: true});
    });
    // fetches us data and push to data object
    fetchData(COVID19API_US).then(USData => {
      for (var i = 0; i < USData.locations.length; i++) {
        data.locations.push(USData.locations[i]);
      }

      this.setState({usData: true});
    });
  }

  // resize the map on window's resize
  resize() {
    let currCenter = this.googleMap.getCenter();
    window.google.maps.event.trigger(this.googleMap, 'resize');
    this.googleMap.setCenter(currCenter);
  }

  // initalizes the deck gl layers based off the data and the dataParameter
  initLayers() {
    const layers = [
      heatMapLayer(data, this.state.dataParameter),
      scatterPlotLayer(data, this.state.dataParameter),
      hoverPlotLayer(data, this.state.dataParameter),
    ];
    // sets overlay to google map
    this.overlay = new GoogleMapsOverlay({
      layers: layers,
    });

    this.overlay.setMap(this.googleMap);
    this.setState({layers: layers});
  }

  // used to change layers based off the layer booleans
  changeLayers() {
    getInfo(data, this.state.dataParameter);
    const layers = [
      this.state.heatMap ? heatMapLayer(data, this.state.dataParameter) : null,
      this.state.scatterPlot ? scatterPlotLayer(data, this.state.dataParameter) : null,
      hoverPlotLayer(data, this.state.dataParameter),
    ]

    this.setState({layers: layers}); // updates the state
    this.overlay.setProps({layers: layers}); // updates the google maps overlay via props
  }

  // on state update acts accordingly
  componentDidUpdate(prevProps, prevState) {
    // creates clone of the objects
    const state = {...this.state };
    const prevStateObj = {...prevState };
    const stateLayers = this.state.layers.length;
    // ignores unwanted things to avoid max depth limit
    state.layers = 0;
    prevStateObj.layers = 0;
    // init layers is both data sources have been fetched, ignores this if layers have been init
    if (this.state.usData && this.state.worldData && stateLayers === 0) {
      getInfo(data, this.state.dataParameter);
      this.initLayers();
    // checks if anything has been updates and if layers have been init
    } else if ((JSON.stringify(state) !== JSON.stringify(prevStateObj)) && stateLayers !== 0) {
      this.changeLayers();
    }
  }

  render() {
    return (
      <div className="map-container">
        {!(this.state.usData && this.state.worldData) && <Loading/>}
        <div id="tooltip" className="displayNone" style={{position: 'absolute', zIndex: 3}}></div>
        <button
          style={{backgroundColor: this.state.heatMap ? '#FFF' : "#cfcfcf"}}
          onClick={() => this.setState({heatMap: !this.state.heatMap})}>
          Heat Map </button>
        <button
          style={{backgroundColor: this.state.scatterPlot ? '#FFF' : "#cfcfcf"}}
          onClick={() => this.setState({scatterPlot: !this.state.scatterPlot})}>
          Scatterplot </button>
        <div className="divider"/>
        <button
          style={{backgroundColor: (this.state.dataParameter === "confirmed") ? '#FFF' : "#cfcfcf"}}
          onClick={() => this.setState({dataParameter: "confirmed"})}>
          <span role="img" aria-label="confirmed"> 😷 </span> </button>
        <button
          style={{backgroundColor: (this.state.dataParameter === "deaths") ? '#FFF' : "#cfcfcf"}}
          onClick={() => this.setState({dataParameter: "deaths"})}>
          <span role="img" aria-label="deaths"> 💀 </span> </button>

        <div
          id="google-map"
          ref={this.googleMapRef}
        />

      </div>
    )
  }
}

export default GoogleMap;
