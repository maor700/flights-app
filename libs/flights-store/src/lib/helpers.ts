import { Airport, FlightData, FlItem } from '@govemap/flights-app-common';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { Style, Text, Stroke, Fill } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { Geometry } from 'ol/geom';

export const createUUid = ({
  aircraft,
  airline,
  arrival,
  departure,
  flight,
}: FlightData): string => {
  return (
    aircraft.iataCode +
    aircraft.regNumber +
    airline.iataCode +
    arrival.iataCode +
    departure.iataCode +
    flight.iataNumber +
    flight.number
  );
};

const GeoJSONReader = new GeoJSON();

export function geographyToGeoJSONPoint(
  longitude: number,
  latitude: number,
  fill = 'black'
): Feature {
  return GeoJSONReader.readFeature(`{
    "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          ${longitude},
          ${latitude}
        ],
        "style": {
          "fill":"${fill}",
          "stroke-width":"3",
          "fill-opacity":0.6
      },
        "type": "Point"
      }
    }`);
}

export function createFeaturesFromFlights(
  flights: FlItem<FlightData>[],
  selectedAirport: Airport
): Feature<Geometry>[] {
  const features = flights.map(({ data: flightData }) => {
    const { geography, arrival } = flightData;
    const toSelected = arrival.iataCode === selectedAirport?.codeIataAirport;
    const { longitude, latitude } = geography;
    const fill = toSelected ? 'green' : 'red';
    const fea = geographyToGeoJSONPoint(longitude, latitude, fill);
    const style = createFeatureStyleByFlightData(
      flightData,
      (flight) => flight.departure.iataCode === selectedAirport.codeIataAirport
    );
    fea.setStyle(style);
    fea.addEventListener('click', () => {
      alert('1234');
    });
    return fea;
  });

  return features;
}

export function createFeatureStyleByFlightData(
  flight: FlightData,
  shouldBeGreen: (flight: FlightData) => boolean
) {
  const { arrival, departure } = flight;
  const toSelected = shouldBeGreen(flight);
  const fill = toSelected ? 'green' : 'red';
  const style = new Style({
    image: new CircleStyle({
      radius: 8,
      fill: new Fill({ color: fill }),
      stroke: new Stroke({ color: 'white', width: 1 }),
    }),
    stroke: new Stroke({ color: '#000' }),
    text: new Text({
      textBaseline: 'bottom',
      text: toSelected ? departure.iataCode : arrival.iataCode,
      font: '12px Calibri,sans-serif',
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  });

  return style;
}
