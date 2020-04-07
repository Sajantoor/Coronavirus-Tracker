import React from 'react';
import styles from './css/tooltip.css';

class Tooltip extends React.Component {
  render() {
    return(
      <div className="tooltip">
        <h1> {this.props.province}, {this.props.country} </h1>
        <h2> 😷: {this.props.confirmed} </h2>
        <h2> 💀: {this.props.deaths} </h2>
        <p> Lat: {this.props.lat} Lng: {this.props.lng} </p>
        <p> {this.props.update} </p>
      </div>
    )
  }
}

export default Tooltip;
