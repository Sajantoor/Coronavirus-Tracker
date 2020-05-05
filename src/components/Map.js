import React from 'react';
import { scatterPlotLayer, hoverPlotLayer, heatMapLayer, getInfo } from './Deck';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import mapStyles from './map-styles';
// eslint-disable-next-line
import styles from './css/map.css';
import { getData, convertToLocalTime } from '../App';
import Loading from './Loading';
import { getGoogleAPI } from '../Firebase';
import { ReactComponent as GPS } from '../assets/icons/gps.svg';

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.getLocation = this.getLocation.bind(this);
    this.resize = this.resize.bind(this);

    this.state = {
      layers: [], // which layers are being used
      data: false,
      googleInit: false,
      dataParameter: "confirmed", // which dataParameter is currently displayed, confirmed, deaths or recovered
      heatMap: false, // layer booleans
      scatterPlot: true,
    }
  }

  googleMapRef = React.createRef();

  componentWillMount() {
    getData().then((value) => {
      this.setState({data: value});
    });
    // create the google map component and loads the script
    const googleMapScript = document.createElement('script');
    // gets the Google Maps API Key from firebase and creates the map
    const this_ = this;

    getGoogleAPI().then(function(value) {
      console.log(value.data);
      const GOOGLE_MAP_API_KEY = value.data;
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=visualization`;

      window.document.body.appendChild(googleMapScript);
      // initializes the map
      googleMapScript.addEventListener('load', () => {
        this_.googleMap = this_.createGoogleMap();
      });

      this_.setState({googleInit: true});
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

  // resize the map on window's resize
  resize() {
    let currCenter = this.googleMap.getCenter();
    window.google.maps.event.trigger(this.googleMap, 'resize');
    this.googleMap.setCenter(currCenter);
  }

  // initalizes the deck gl layers based off the data and the dataParameter
  initLayers() {
    const layers = [
      this.state.heatMap ? heatMapLayer(this.state.data, this.state.dataParameter) : null ,
      this.state.scatterPlot ? scatterPlotLayer(this.state.data, this.state.dataParameter) : null ,
      hoverPlotLayer(this.state.data, this.state.dataParameter),
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
    getInfo(this.state.data, this.state.dataParameter);
    const layers = [
      this.state.heatMap ? heatMapLayer(this.state.data, this.state.dataParameter) : null,
      this.state.scatterPlot ? scatterPlotLayer(this.state.data, this.state.dataParameter) : null,
      hoverPlotLayer(this.state.data, this.state.dataParameter),
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
    if (this.state.data && this.state.googleInit && stateLayers === 0) {
      getInfo(this.state.data, this.state.dataParameter);
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
