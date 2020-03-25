import React from 'react';
const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

class GoogleMap extends React.Component {
  constructor(props) {
    super(props);

    this.getLocation = this.getLocation.bind(this);
  }

  googleMapRef = React.createRef();

  componentDidMount() {
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {
      this.googleMap = this.createGoogleMap();
    });

    this.requestLocation();
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
      center: {
        lat:  0,
        lng:  0,
      },
      disableDefaultUI: true,
    });

  render() {
    return (
      <div
        id="google-map"
        ref={this.googleMapRef}
        style={{ width: '100vw', height: '100vh' }}
      />
    )
  }
}

export default GoogleMap;
