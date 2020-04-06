import React from 'react';
import DeckGL from '@deck.gl/react';
import { scatterPlotLayer, heatMapLayer, textLayer, getInfo } from './Deck';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import mapStyles from './map-styles';
import { fetchData } from '../App';

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

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
      layers: [],
      worldData: false,
      usData: false,
      dataParameter: "confirmed",
      heatMap: true,
      scatterPlot: true,
    }
  }

  googleMapRef = React.createRef();

  componentDidMount() {
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=visualization`;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {
      this.googleMap = this.createGoogleMap();
      this.getData();
      this.requestLocation();
      window.google.maps.event.addDomListener(window, 'resize', this.resize);
    });
  }

  resize() {
    let currCenter = this.googleMap.getCenter();
    window.google.maps.event.trigger(this.googleMap, 'resize');
    this.googleMap.setCenter(currCenter);
  }

  requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getLocation);
    }
  }

  getLocation(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    this.googleMap.setCenter({lat: lat, lng: lng});
    this.googleMap.setZoom(5);
  }

  createGoogleMap = () =>
    new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 2,
      minZoom: 2,
      center: {
        lat:  0,
        lng:  0,
      },
      disableDefaultUI: true,
      styles: mapStyles,
      gestureHandling: 'greedy',
    });

  getData() {
    const COVID19API_WORLD = "https://coronavirus-tracker-api.herokuapp.com/v2/locations";
    const COVID19API_US = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs";

    fetchData(COVID19API_WORLD).then(worldData => {
      // removes all US data as US has it's own source and removes NULL island
      worldData.locations = worldData.locations.filter(d => d.country !== "US" && d.province !== "Grand Princess" && (d.coordinates.latitude !== "0" && d.coordinates.longitude !== "0"));

      for (var i = 0; i < worldData.locations.length; i++) {
        data.locations.push(worldData.locations[i]);
      }

      data.latest = worldData.latest;
      this.setState({worldData: true});
    });

    fetchData(COVID19API_US).then(USData => {
      for (var i = 0; i < USData.locations.length; i++) {
        data.locations.push(USData.locations[i]);
      }

      this.setState({usData: true});
    });
  }

  initLayers() {
    const layers = [
      heatMapLayer(data, this.state.dataParameter),
      scatterPlotLayer(data, this.state.dataParameter),
    ];

    this.overlay = new GoogleMapsOverlay({
      layers: layers,
    });

    this.overlay.setMap(this.googleMap);
    this.setState({layers: layers});
  }

  changeLayers() {
    getInfo(data, this.state.dataParameter);
    const layers = [
      this.state.heatMap ? heatMapLayer(data, this.state.dataParameter) : null,
      this.state.scatterPlot ? scatterPlotLayer(data, this.state.dataParameter) : null,
    ]

    this.setState({layers: layers});
    this.overlay.setProps({layers: layers});
  }

  componentDidUpdate(prevProps, prevState) {
    const state = {...this.state };
    const stateLayers = this.state.layers.length;
    const prevStateObj = {...prevState };
    // ignores layers to avoid max depth limit
    prevStateObj.layers = 0;
    state.layers = 0;
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
        <button onClick={() => this.setState({heatMap: !this.state.heatMap})}> Heat Map </button>
        <button onClick={() => this.setState({scatterPlot: !this.state.scatterPlot})}> Scatterplot </button>
        <button onClick={() => this.setState({dataParameter: "confirmed"})}> <span role="img" aria-label="confirmed"> 😷 </span></button>
        <button onClick={() => this.setState({dataParameter: "deaths"})}> <span role="img" aria-label="deaths"> 💀 </span> </button>


        <div
          id="google-map"
          ref={this.googleMapRef}
          style={{ width: '100vw', height: '100vh'}}
        />

      </div>
    )
  }
}

export default GoogleMap;
