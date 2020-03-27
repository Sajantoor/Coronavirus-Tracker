import React from 'react';
import { fetchData } from '../App';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import data from '../data.json';

const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const scatterPlotLayer = () => new ScatterplotLayer({
  id: 'scatter',
  data: data.locations,
  opacity: 0.8,
  filled: true,
  radiusMaxPixels: 5,
  radiusMinPixels: 3,
  getPosition: d => [parseInt(d.coordinates.longitude), parseInt(d.coordinates.latitude)],
  getFillColor: d => d.latest.confirmed > 10 ? [200, 0, 40, 150] : [255, 140, 0, 100],
});

const heatMapLayer = () => new HeatmapLayer({
  id: 'heat',
  data: data.locations,
  getPosition: d => [parseInt(d.coordinates.longitude), parseInt(d.coordinates.latitude)],
  getWeight: d => parseInt(d.latest.confirmed),
  radiusPixels: 60,
  threshold: 0.005,
});

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.getLocation = this.getLocation.bind(this);
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
    const overlays = new GoogleMapsOverlay({
      layers: [
        scatterPlotLayer(),
        heatMapLayer(),
      ]
    });

    overlays.setMap(this.googleMap);
  }

  createGoogleMap = () =>
    new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 2,
      center: {
        lat:  0,
        lng:  0,
      },
      disableDefaultUI: true,
    });


  getData() {

  }

  render() {
    return (
      <div
        id="google-map"
        ref={this.googleMapRef}
        style={{ width: '100vw', height: '100vh'}}
      />
    )
  }
}

export default GoogleMap;
