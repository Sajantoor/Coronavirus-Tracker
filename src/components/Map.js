import React from 'react';
import DeckGL from '@deck.gl/react';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import data from '../data.json';
import geoJson from '../geo.json';
import mapStyles from './map-styles';

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
  radiusPixels: 50,
  threshold: 0.005,
});

const geoJsonLayer = () => new GeoJsonLayer({
  id: 'geo-json',
  data: geoJson,
  stroked: false,
  filled: true,
  extruded: true,
  lineWidthScale: 20,
  lineWidthMinPixels: 2,
  getFillColor: d => getWeight(d.properties.name),
  getRadius: 100,
})

const leader = data.locations.find(element => element.country === "US").latest.confirmed;

function getColor(value) {
  const low = [255, 158, 158, 255];
  const high = [163, 28, 28, 255];

  // delta represents where the value sits between the min and max
  let delta = value / leader;

  let color = [];
  for (var i = 0; i < 3; i++) {
    color[i] = (high[i] - low[i]) * delta + low[i];
  }

  return high;

}

function getWeight(name) {
  try {
    let obj = data.locations.find(element => element.province === name || element.country === name);
    let weight = obj.latest.confirmed;
    let color = getColor(weight);
    return color;
  } catch (error) {
    return 0;
  }
}


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
        // geoJsonLayer(),
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
      styles: mapStyles,
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
