import React from 'react';
// eslint-disable-next-line
import styles from './css/tooltip.css';

class Tooltip extends React.Component {
  // all data is passed via props
  render() {
    return(
      <div className="tooltip">
        <h1> {this.props.province ? this.props.province + "," : null} {this.props.country} </h1>
        <h2> <span role="img" aria-label="confirmed">😷</span>: {this.props.confirmed} </h2>
        <h2> <span role="img" aria-label="deaths">💀</span>: {this.props.deaths} </h2>
        <p> Lat: {this.props.lat} Lng: {this.props.lng} </p>
        <p> {this.props.update} </p>
      </div>
    )
  }
}

export default Tooltip;
