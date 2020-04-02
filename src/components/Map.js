import React from 'react';
import DeckGL from '@deck.gl/react';
import { scatterPlotLayer, heatMapLayer, textLayer, getInfo } from './Deck';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import mapStyles from './map-styles';
import { fetchData } from '../App';

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
let data;

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.getLocation = this.getLocation.bind(this);

    this.state = {
      layers: [],
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
    });
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

  initLayers() {
    const layers = [
      heatMapLayer(data),
      scatterPlotLayer(data),
    ];

    this.overlay = new GoogleMapsOverlay({
      layers: layers,
    });

    this.overlay.setMap(this.googleMap);
    this.setState({layers: layers});
  }

  createGoogleMap = () =>
    new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 2,
      center: {
        lat:  0,
        lng:  0,
      },
      disableDefaultUI: true,
      styles: mapStyles,
    });

  getData() {
    const COVID19API_WORLD = "https://coronavirus-tracker-api.herokuapp.com/v2/locations";
    const COVID19API_US = "https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs";

    fetchData(COVID19API_WORLD).then(worldData => {
      const filtered = worldData.locations.filter(d => d.country !== "US");
      worldData.locations = filtered;
      console.log(worldData);

      // BUG: There's a data point in California which shouldn't be there.
      // OPTIMIZE:  Data is fetched at the same time to imporve loading times
      fetchData(COVID19API_US).then(USData => {
        for (var i = 0; i < USData.locations.length; i++) {
          worldData.locations.push(USData.locations[i]);
        }

        data = worldData;
        console.log(data);
        getInfo(data);
        this.initLayers();
      });
    });
  }

  changeLayers() {
    const layers = [
      this.state.heatMap ? heatMapLayer(data) : null,
      this.state.scatterPlot ? scatterPlotLayer(data) : null,
    ]

    this.setState({layers: layers});
    this.overlay.setProps({layers: layers});
  }

  componentDidUpdate(prevProps, prevState) {
    // OPTIMIZE: Better way to check if the booleans have changed here
    if (this.state.heatMap !== prevState.heatMap || this.state.scatterPlot !== prevState.scatterPlot) {
      this.changeLayers();
    }
  }

  render() {
    return (
      <div className="map-container">
        <div
          id="google-map"
          ref={this.googleMapRef}
          style={{ width: '100vw', height: '100vh'}}
        />

      <button onClick={() => this.setState({heatMap: !this.state.heatMap})}> Heat Map </button>
      </div>
    )
  }
}

export default GoogleMap;
