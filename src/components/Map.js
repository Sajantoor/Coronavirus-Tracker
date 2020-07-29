import React from 'react';
import { scatterPlotLayer, hoverPlotLayer, heatMapLayer, getInfo } from './Deck';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import mapStyles from './map-styles';
// eslint-disable-next-line
import styles from './css/map.css';
import { fetchData, convertToLocalTime } from '../App';
import Loading from './Loading';
import { ReactComponent as GPS } from '../assets/icons/gps.svg';

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
      heatMap: false, // layer booleans
      scatterPlot: true,
    }
  }

  googleMapRef = React.createRef();

  componentDidMount() {
    this.getData();

    const _this = this;
    // create the google map component and loads the script
    const googleMapScript = document.createElement('script');
    // gets the Google Maps API Key from firebase and creates the map
    const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API;
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=visualization`;
  
    window.document.body.appendChild(googleMapScript);
    // initializes the map
    googleMapScript.addEventListener('load', () => {
      _this.googleMap = _this.createGoogleMap();
    });
  
  }

  // creates the google map component
  createGoogleMap() {
    let map =  new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 3,
      minZoom: 2,
      center: {
        lat:  30,
        lng:  0,
      },
      restriction: {
        latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180
        }
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
    navigator.geolocation.getCurrentPosition(this.getLocation);
  }

  // changes the center to be the user's location to see data points close to them first
  getLocation(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    this.googleMap.setCenter({lat: lat, lng: lng});
    this.googleMap.setZoom(7);
  }

  // fetches the data from the apis
  getData() {
    // sources
    const COVID19API_WORLD = "https://covid-tracker-us.herokuapp.com/v2/locations?source=jhu&timelines=false";
    const COVID19API_US = "https://covid-tracker-us.herokuapp.com/v2/locations?source=csbs&timelines=false";
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
      this.setState({worldData: true});
    });
    // fetches us data and push to data object
    fetchData(COVID19API_US).then(USData => {
      for (var i = 0; i < USData.locations.length; i++) {
        USData.locations[i].last_updated = convertToLocalTime(USData.locations[i].last_updated);
        USData.locations[i].coordinates.latitude = parseFloat(USData.locations[i].coordinates.latitude);
        USData.locations[i].coordinates.longitude = parseFloat(USData.locations[i].coordinates.longitude);
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
      this.state.heatMap ? heatMapLayer(data, this.state.dataParameter) : null ,
      this.state.scatterPlot ? scatterPlotLayer(data, this.state.dataParameter) : null ,
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
          style={{backgroundColor: this.state.scatterPlot ? '#FFF' : "#cfcfcf"}}
          onClick={() => this.setState({scatterPlot: !this.state.scatterPlot})}>
          Scatterplot
        </button>

        <button
          style={{backgroundColor: this.state.heatMap ? '#FFF' : "#cfcfcf"}}
          onClick={() => this.setState({heatMap: !this.state.heatMap})}>
          Heat Map
        </button>

        <div className="divider"/>
        <button
          style={{backgroundColor: (this.state.dataParameter === "confirmed") ? '#FFF' : "#cfcfcf"}}
          onClick={() => this.setState({dataParameter: "confirmed"})}>
          <span role="img" aria-label="confirmed"> 😷 </span>
        </button>

        <button
          style={{backgroundColor: (this.state.dataParameter === "deaths") ? '#FFF' : "#cfcfcf"}}
          onClick={() => this.setState({dataParameter: "deaths"})}>
          <span role="img" aria-label="deaths"> 💀 </span>
        </button>

        {
          navigator.geolocation &&
          <button
            className="location"
            aria-label="Location"
            onClick={() => this.requestLocation()}>
            <GPS/>
          </button>
        }

        <div
          id="google-map"
          ref={this.googleMapRef}
        />

      </div>
    )
  }
}

export default GoogleMap;
