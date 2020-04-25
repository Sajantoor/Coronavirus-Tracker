import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from './Tooltip';
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

// gets the highest, the lowest and the average cases of COVID19
const info = {
  largest: 0,
  average: 0,
}

// some sorting algorithm here instead later
// gets info to prep picking colors
function getInfo(data, dataParameter) {
  info.largest = 0;
  info.average = 0;
  // gets the value by the dataParameter
  for (var i = 0; i < data.locations.length; i++) {
    if (data.locations[i][dataParameter].latest > info.largest) {
      info.largest = data.locations[i][dataParameter].latest;
    }
  }
  // gets the average case value
  info.average = data.latest[dataParameter] / (data.locations.length + 1);
}

// selects a color for scatterplot layers
function pickColor(value) {
  // the range of colors, green to red
  const low = [3, 252, 11];
  const high = [252, 181, 3];
  // color modifiying delta
  const delta = (value / Math.sqrt(info.largest));
  // get the color value based off the range
  const color = [];
  for (var i = 0; i < 3; i++) {
    color[i] = parseInt((high[i] - low[i]) * delta + low[i]);
    if (color[i] > 255) {
      color[i] = 255;
    } else if (color[i] < 0) {
      color[i] = 0;
    }
  }
  // set opacity
  if (value < Math.cbrt(info.average)) {
    const opacityValue = value / Math.cbrt(info.average);
    const opacityLimit = 50;

    color[3] = opacityValue * 255;
    // sets opacity limit
    if (opacityLimit > color[3]) {
      // for 0 cases change opacity to be noticeably different
      if (value === 0) {
        color[3] = opacityLimit / 2;
      }
       color[3] = opacityLimit;
    }

  } else {
    color[3] = 255;
  }

  return color;
}

// check if the mouse is moving
document.addEventListener('mousemove', checkMovement);
let isHovering = false;

// deck gl doesn't have any way to check if not hovering, so looks at mouse movement vs deck gl's hovering to determine if hovering or not
// fixes issue where tooltip still shows and gets stuck after dragging unless hovered somewhere
function checkMovement(e) {
  const el = document.getElementById('tooltip');
  // mouse x and y
  const x = e.clientX;
  const y = e.clientY;

  // change tooltip style if hovering
  if (isHovering) {
    el.className = 'displayBlock';
    el.style.left = (x + 10) + 'px';
    el.style.top = (y + 10) + 'px';
  } else {
    // stop displaying the element
    el.className = 'displayNone';
  }

  isHovering = false;
}

// function called onHover for deck gl layers, used to check if the user is hovering and render tooltip accordingly
function setTooltip(object, x, y, last_updated) {
  const el = document.getElementById('tooltip');
  if (object) {

    console.log(object);
    const lat = object.coordinates.lat.toFixed(2);
    const lng = object.coordinates.long.toFixed(2);
    isHovering = true;

    ReactDOM.render(<Tooltip
      province={object.province ? object.province : object.county}
      country={object.country}
      confirmed={object.confirmed.latest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      deaths={object.deaths.latest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      lat={lat}
      lng={lng}
      update={last_updated}
      />, el);
  }
}

// Deck gl layers
const scatterPlotLayer = (data, dataParameter) => new ScatterplotLayer({
  id: 'scatter',
  data: data.locations,
  opacity: 1,
  filled: true,
  radiusMaxPixels: 7,
  radiusMinPixels: 3,
  getPosition: d => [d.coordinates.long, d.coordinates.lat],
  getFillColor: d => pickColor(d[dataParameter].latest),
  updateTriggers: {
    getFillColor: d => pickColor(d[dataParameter].latest),
  }
});

// layer used to check if there is user hovering, radius is much bigger than scatterplot
const hoverPlotLayer = (data, dataParameter) => new ScatterplotLayer({
  id: 'hover',
  data: data.locations,
  opacity: 0,
  filled: true,
  radiusMaxPixels: 50,
  radiusMinPixels: 30,
  getPosition: d => [d.coordinates.long, d.coordinates.lat],
  onHover: info => setTooltip(info.object, info.x, info.y, data.latest.last_updated),
  pickable: true,
});

const heatMapLayer = (data, dataParameter) => new HeatmapLayer({
  id: 'heat',
  data: data.locations,
  getPosition: d => [d.coordinates.long, d.coordinates.lat],
  getWeight: d => d[dataParameter].latest,
  radiusPixels: 60,
  threshold: 0.005,
  updateTriggers: {
    getWeight: d => d[dataParameter].latest,
  }
});

export { scatterPlotLayer, hoverPlotLayer, heatMapLayer, getInfo };
