import data from '../data.json';
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';

// gets the highest, the lowest and the average cases of COVID19
const info = {
  largest: 0,
  average: 0,
}

// some sorting algorithm here instead later
function getInfo() {
  let sum = 0;
  for (var i = 0; i < data.locations.length; i++) {
    if (data.locations[i].latest.confirmed > info.largest) {
      info.largest = data.locations[i].latest.confirmed;
    }
  }

  info.average = data.latest.confirmed / (data.locations.length + 1);
}

getInfo();

function calculateSize(value, avgValue, avg, max, min) {
  let ratio = value / avgValue;
  let size = ratio * avg;

  if (size > max) {
    size = max;
  } else if (size < min) {
    size = min;
  }
  console.log(size);
  return size;
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
  color[3] = 255;

  return color;
}

const scatterPlotLayer = () => new ScatterplotLayer({
  id: 'scatter',
  data: data.locations,
  opacity: 1,
  filled: true,
  radiusMaxPixels: 7,
  radiusMinPixels: 3,
  getPosition: d => [parseInt(d.coordinates.longitude), parseInt(d.coordinates.latitude)],
  getFillColor: d => pickColor(d.latest.confirmed),
});

const heatMapLayer = () => new HeatmapLayer({
  id: 'heat',
  data: data.locations,
  getPosition: d => [parseInt(d.coordinates.longitude), parseInt(d.coordinates.latitude)],
  getWeight: d => parseInt(d.latest.confirmed),
  radiusPixels: 60,
  threshold: 0.005,
});

const textLayer = () => new TextLayer({
  id: 'text',
  data: data.locations,
  getPosition: d => [parseInt(d.coordinates.longitude), parseInt(d.coordinates.latitude)],
  getText: d => d.latest.confirmed.toString(),
  getSize: 20,
  getAngle: 0,
  getColor: [255, 255, 255, 255],
  getTextAnchor: 'middle',
  getAlignmentBaseline: 'center',
});


export { scatterPlotLayer, heatMapLayer, textLayer };
