import React from 'react';
import DeckGL from '@deck.gl/react';
import { scatterPlotLayer, heatMapLayer, textLayer } from './Deck';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import mapStyles from './map-styles';

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.getLocation = this.getLocation.bind(this);

    this.state = {
      layers: [
        heatMapLayer(),
        scatterPlotLayer(),
      ],

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
      this.initLayers();
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
    this.overlay = new GoogleMapsOverlay({
      layers: this.state.layers,
    });

    this.overlay.setMap(this.googleMap);
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

  }

  componentDidUpdate(prevProps, prevState) {
    // OPTIMIZE: Better way to check if the booleans have changed here
    if (this.state.heatMap !== prevState.heatMap || this.state.scatterPlot !== prevState.scatterPlot) {
      this.changeLayers();
    }
  }

  changeLayers() {
    const layers = [
      this.state.heatMap ? heatMapLayer() : null,
      this.state.scatterPlot ? scatterPlotLayer() : null,
    ]

    this.setState({layers: layers});

    this.overlay.setProps({layers: layers});
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
