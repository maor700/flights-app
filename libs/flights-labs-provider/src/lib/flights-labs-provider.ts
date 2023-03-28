import {
  AirportsReqParams,
  AirportsRes,
  FlightsReqParams,
  FlightsResponse,
} from '@govemap/flights-app-common';
import { airportResponse } from './airportsResponse';

const FLIGHTS_BASE_URL = window.location.origin + '/api';

export const getFlights = async (params?: Partial<FlightsReqParams>) => {
  const url = buildUrl(`${FLIGHTS_BASE_URL}/flights`, params);
  const { data, success }: FlightsResponse = await fetch(url).then((res) =>
    res.json()
  );

  if (!success) throw new Error('Error accured');

  return data;
};

export const getAirports = async (params?: Partial<AirportsReqParams>) => {
  // const url = buildUrl(`${FLIGHTS_BASE_URL}/airports`, params);
  // const { data, success }: AirportsRes = await fetch(url).then((res) =>
  //   res.json()
  // );
  const { data, success }: AirportsRes = airportResponse;

  if (!success) throw new Error('Error accured');

  return data;
};

const buildUrl = (routeURL: string, params?: Record<string, string>) => {
  const URLWithParams = new URL(routeURL);

  params &&
    Object.entries(params).forEach((param) =>
      URLWithParams.searchParams.append(...param)
    );

  return URLWithParams.href;
};
