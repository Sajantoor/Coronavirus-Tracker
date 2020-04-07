import React from 'react';
//eslint-disable-next-line
import styles from './css/loading.css';

class Loading extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [
        "Stay home and practice social distancing!",
        "Social distancing is the best way to prevent the spread of COVID-19.",
        "Stay home, stay safe!",
        "Stay at least 2 metres away from others...",
        "Wash your hands regularly!",
        "Wash your hands for at least 20 seconds!",
      ],
      index: 0,
    }
  }

  pickRandom() {
    const index = Math.floor(Math.random()* this.state.messages.length);
    console.log(index);
    this.setState({index: index});
  }

  componentDidMount() {
    this.pickRandom();
  }

  render() {
    return(
      <div className="loading">
        <div class="progress"></div>
        <h1> Loading 2,500+ COVID-19 (Coronavirus) data points <span role="img" aria-label="sick-emoji">😷</span> </h1>
        <p> {this.state.messages[this.state.index]} </p>
      </div>
    )
  }
}

export default Loading;
