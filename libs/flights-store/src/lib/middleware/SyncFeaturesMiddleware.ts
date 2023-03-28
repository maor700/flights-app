import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { FlightsStore } from '../flights-store';
import { createFeaturesFromFlights } from '../helpers';

export const SyncFeaturesMiddleware =
  (config: any) => (set: any, get: any, api: any) =>
    config(
      (...args: any[]) => {
        const [payloadState, ...rest] = args;
        const { flights: _flights, selectedAirport: _selectedAirport } =
          payloadState;
        if (!_flights && _selectedAirport === undefined) set(...args);
        const currState = get() as FlightsStore;
        const flights = _flights ?? currState?.flights;
        const selectedAirport = _selectedAirport ?? currState?.selectedAirport;
        const features: Feature<Geometry>[] = createFeaturesFromFlights(
          flights,
          selectedAirport
        );
        const newState: FlightsStore = { ...payloadState, features, flights };
        set(newState, ...rest);
      },
      get,
      api
    );
