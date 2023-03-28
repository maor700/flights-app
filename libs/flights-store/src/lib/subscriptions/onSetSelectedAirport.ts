import { Airport, FlightData } from '@govemap/flights-app-common';
import { getFlights } from '@govemap/flights-labs-provider';
import { useFlightsStore } from '../flights-store';

export const onSetSelectedAirport = ()=>(useFlightsStore.subscribe as any)(
  (state: any) => state.selectedAirport,
  async (selectedAirport: Airport | null) => {
    if (!selectedAirport) return;
    const setteledData = await Promise.allSettled([
      getFlights({ depIata: selectedAirport.codeIataAirport }),
      getFlights({ arrIata: selectedAirport.codeIataAirport }),
    ]);
    const flights = setteledData.reduce<FlightData[]>((sum, currsetteled) => {
      if (currsetteled.status !== 'fulfilled') return sum;
      return sum.concat(currsetteled.value);
    }, []);
    useFlightsStore.getState().setFlights(flights);
  }
);
