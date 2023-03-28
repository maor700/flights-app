import { create } from 'zustand';
import { subscribeWithSelector, devtools } from 'zustand/middleware';
import { Airport, FlightData, FlItem } from '@govemap/flights-app-common';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { createUUid } from './helpers';
import { SyncFeaturesMiddleware } from './middleware/SyncFeaturesMiddleware';
import { onSetSelectedAirport } from './subscriptions/onSetSelectedAirport';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import './subscriptions/onSetSelectedAirport';

type FlightsStoreData = {
  flights: FlItem<FlightData>[];
  features: Feature<Geometry>[];
  airports: Airport[];
  selectedAirport: Airport | null;
};

type FlightsStoreActions = {
  setFlights: (flights: FlightData[]) => void;
  setFeatures: (features: Feature<Geometry>[]) => void;
  setAirports: (airports: Airport[]) => void;
  setSelectedAirport: (airport: Airport) => void;
};

export type FlightsStore = FlightsStoreData & FlightsStoreActions;

export const useFlightsStore = create<FlightsStore>(
  SyncFeaturesMiddleware(
    subscribeWithSelector(
      devtools((set: any, get: any) => ({
        flights: [],
        features: [],
        airports: [],
        selectedAirport: null,
        setFlights: function setFlights(flightsRaw: FlightData[]){
          const flights: FlItem<FlightData>[] = flightsRaw.map((flightData) => {
            const id = createUUid(flightData);
            return { id, data: flightData };
          });
          set({ flights });
        },
        setFeatures: (features: Feature<Geometry>[]) => {
          set({ features });
        },
        setAirports: (airports: Airport[]) => {
          set({ airports });
        },
        setSelectedAirport: async (selectedAirport: Airport) => {
          const { selectedAirport: curr_selectedAirport } =
            get() as FlightsStore;
          if (curr_selectedAirport === selectedAirport) return;

          set({ selectedAirport });
        },
      }))
    )
  )
);

///subscriptions

onSetSelectedAirport();
