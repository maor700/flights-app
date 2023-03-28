// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DEFAULT_MAP_OPTIONS, OLMap } from './OLMap/OLMap';
import { useCallback, useEffect, useMemo } from 'react';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { AirportsCombo } from './Combobox/Combobox';
import { OLPopup } from './OLPopup/OLPopup';
import { getAirports } from '@govemap/flights-labs-provider';
import { useFlightsStore } from '@govemap/flights-store';
import './app.scss';

export function App() {
  const flights = useFlightsStore((state) => state.flights);
  const features = useFlightsStore((state) => state.features);
  const airports = useFlightsStore((state) => state.airports);
  const { setAirports, setSelectedAirport } = useFlightsStore((state) => ({
    setAirports: state.setAirports,
    setFlights: state.setFlights,
    setSelectedAirport: state.setSelectedAirport,
  }));

  const getAirportsHandler = useCallback(() => {
    getAirports().then(setAirports);
  }, [setAirports]);

  useEffect(() => {
    getAirportsHandler();
  }, [getAirportsHandler]);

  const mapOptions = useMemo(() => {
    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      // style: styleFunction,
    });

    return { layers: [...(DEFAULT_MAP_OPTIONS as any).layers, vectorLayer] };
  }, [features]);

  return (
    <div className="app-con full-size">
      <div className="flights-list">
        <button onClick={getAirportsHandler}>Get Airports</button>
        <AirportsCombo
          onChange={setSelectedAirport}
          airports={airports}
        ></AirportsCombo>
        <h6>Active Flights</h6>
        <div>
          {flights?.map(
            ({ id, data: { departure, arrival, flight, aircraft } }) => {
              return (
                <div key={aircraft.icao24 + flight.iataNumber}>
                  {flight.iataNumber}
                </div>
              );
            }
          )}
        </div>
      </div>

      <OLMap options={mapOptions}>
        <OLPopup name="test">
          <h2>Hi from popup!</h2>
        </OLPopup>
      </OLMap>
    </div>
  );
}

export default App;
