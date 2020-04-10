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
    if (data.locations[i].latest[dataParameter] > info.largest) {
      info.largest = data.locations[i].latest[dataParameter];
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

// converts the ISO 8601 timezone value from the data to the user's local time zone value
function convertToLocalTime(value) {
  let date = new Date(value);
  return date.toLocaleString();
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
function setTooltip(object, x, y) {
  const el = document.getElementById('tooltip');
  if (object) {
    const lat = parseFloat(object.coordinates.latitude).toFixed(3);
    const lng = parseFloat(object.coordinates.longitude).toFixed(3);
    isHovering = true;

    ReactDOM.render(<Tooltip
      province={object.province ? object.province : object.county}
      country={object.country}
      confirmed={object.latest.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      deaths={object.latest.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      lat={lat}
      lng={lng}
      update={convertToLocalTime(object.last_updated)}
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
  getPosition: d => [parseFloat(d.coordinates.longitude), parseFloat(d.coordinates.latitude)],
  getFillColor: d => pickColor(d.latest[dataParameter]),
  updateTriggers: {
    getFillColor: d => pickColor(d.latest[dataParameter]),
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
  getPosition: d => [parseFloat(d.coordinates.longitude), parseFloat(d.coordinates.latitude)],
  onHover: info => setTooltip(info.object, info.x, info.y),
  pickable: true,
});

const heatMapLayer = (data, dataParameter) => new HeatmapLayer({
  id: 'heat',
  data: data.locations,
  getPosition: d => [parseFloat(d.coordinates.longitude), parseFloat(d.coordinates.latitude)],
  getWeight: d => parseInt(d.latest[dataParameter]),
  radiusPixels: 60,
  threshold: 0.005,
  updateTriggers: {
    getWeight: d => parseInt(d.latest[dataParameter]),
  }
});

const textLayer = (data, dataParameter) => new TextLayer({
  id: 'text',
  data: data.locations,
  getPosition: d => [parseFloat(d.coordinates.longitude), parseFloat(d.coordinates.latitude)],
  getText: d => d.latest[dataParameter].toString(),
  getSize: 20,
  getAngle: 0,
  getColor: [255, 255, 255, 255],
  getTextAnchor: 'middle',
  getAlignmentBaseline: 'center',
});


export { scatterPlotLayer, hoverPlotLayer, heatMapLayer, textLayer, getInfo };
