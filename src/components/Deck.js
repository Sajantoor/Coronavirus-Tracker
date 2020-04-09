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
function getInfo(data, dataParameter) {
  info.largest = 0;
  info.average = 0;

  for (var i = 0; i < data.locations.length; i++) {
    if (data.locations[i].latest[dataParameter] > info.largest) {
      info.largest = data.locations[i].latest[dataParameter];
    }
  }

  info.average = data.latest[dataParameter] / (data.locations.length + 1);
}

function pickColor(value) {
  const low = [3, 252, 11];
  const high = [252, 181, 3];

  const delta = (value / Math.sqrt(info.largest));

  const color = [];
  for (var i = 0; i < 3; i++) {
    color[i] = parseInt((high[i] - low[i]) * delta + low[i]);
    if (color[i] > 255) {
      color[i] = 255;
    } else if (color[i] < 0) {
      color[i] = 0;
    }
  }

  if (value < Math.cbrt(info.average)) {
    const opacityValue = value / Math.cbrt(info.average);
    const opacityLimit = 50;

    color[3] = opacityValue * 255;

    if (opacityLimit > color[3]) {
      color[3] = opacityLimit;
    }

  } else {
    color[3] = 255;
  }

  return color;
}

function convertToLocalTime(value) {
  let date = new Date(value);
  return date.toLocaleString();
}

document.addEventListener('mousemove', checkMovement);
let isHovering = false;

// deck gl doesn't have any way to check if not hovering, so looks at mouse movement vs deck gl's hovering to determine if hovering or not
// fixes issue where tooltip still shows and gets stuck after dragging unless hovered somewhere
function checkMovement(e) {
  const el = document.getElementById('tooltip');
  const x = e.clientX;
  const y = e.clientY;

  if (isHovering) {
    el.className = 'displayBlock';
    el.style.left = (x + 10) + 'px';
    el.style.top = (y + 10) + 'px';
  } else {
    el.className = 'displayNone';
  }

  isHovering = false;
}

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


// because there is no good way to change the radius of the hover area.
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
