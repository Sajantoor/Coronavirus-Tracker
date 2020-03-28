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
  for (var i = 0; i < data.locations.length; i++) {
    if (data.locations[i].latest.confirmed > info.largest) {
      info.largest = data.locations[i].latest.confirmed;
    }
  }

  info.average = data.latest.confirmed / (data.locations.length + 1);
}

getInfo();

function pickColor(value) {
  let low = [3, 252, 11];
  let high = [252, 181, 3];

  let delta = (value / Math.sqrt(info.largest));

  var color = [];
  for (var i = 0; i < 3; i++) {
    color[i] = parseInt((high[i] - low[i]) * delta + low[i]);
    if (color[i] > 255) {
      color[i] = 255;
    } else if (color[i] < 0) {
      color[i] = 0;
    }
  }

  return color;
}

const scatterPlotLayer = () => new ScatterplotLayer({
  id: 'scatter',
  data: data.locations,
  opacity: 1,
  filled: true,
  stroked: true,
  getLineColor: [255, 255, 255, 255],
  lineWidthMinPixels: 2,
  radiusMaxPixels: 30,
  radiusMinPixels: 20,
  getPosition: d => [parseInt(d.coordinates.longitude), parseInt(d.coordinates.latitude), (d.latest.confirmed / info.average) * 10],
  getFillColor: d => pickColor(d.latest.confirmed),
});

const heatMapLayer = () => new HeatmapLayer({
  id: 'heat',
  data: data.locations,
  getPosition: d => [parseInt(d.coordinates.longitude), parseInt(d.coordinates.latitude)],
  getWeight: d => parseInt(d.latest.confirmed),
  radiusPixels: 50,
  threshold: 0.005,
});

const textLayer = () => new TextLayer({
  id: 'text',
  data: data.locations,
  getPosition: d => [parseInt(d.coordinates.longitude), parseInt(d.coordinates.latitude), (d.latest.confirmed / info.average) * 10],
  getText: d => d.latest.confirmed.toString(),
  getSize: 20,
  getAngle: 0,
  getColor: [255, 255, 255, 255],
  getTextAnchor: 'middle',
  getAlignmentBaseline: 'center',
});


export { scatterPlotLayer, heatMapLayer, textLayer };
