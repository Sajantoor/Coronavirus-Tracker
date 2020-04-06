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

function calculateSize(value, avgValue, avg, max, min) {
  let ratio = value / avgValue;
  let size = ratio * avg;

  if (size > max) {
    size = max;
  } else if (size < min) {
    size = min;
  }
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

const scatterPlotLayer = (data, dataParameter) => new ScatterplotLayer({
  id: 'scatter',
  data: data.locations,
  opacity: 1,
  filled: true,
  radiusMaxPixels: 7,
  radiusMinPixels: 3,
  getPosition: d => [parseFloat(d.coordinates.longitude), parseFloat(d.coordinates.latitude), 0],
  getFillColor: d => pickColor(d.latest[dataParameter]),
  updateTriggers: {
    getFillColor: d => pickColor(d.latest[dataParameter]),
  }
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


export { scatterPlotLayer, heatMapLayer, textLayer, getInfo };
