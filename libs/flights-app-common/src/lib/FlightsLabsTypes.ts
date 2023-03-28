export interface FlightLabsResponse<T> {
  success: boolean;
  data: T;
}

// Flights
// req params

export interface FlightsReqParams {
  limit: string;
  flightIata: string;
  flightIcao: string;
  flightNum: string;
  airlineIata: string;
  airlineIcao: string;
  depIata: string;
  depIcao: string;
  arrIata: string;
  arrIcao: string;
  aircraftIcao: string;
  regNum: string;
  aircraftIcao24: string;
  status: string;
}

// res 
export type FlightsResponse = FlightLabsResponse<FlightData[]>;

export interface FlightData {
  aircraft: Aircraft;
  airline: Airline;
  arrival: Airline;
  departure: Airline;
  flight: Flight;
  geography: Geography;
  speed: Speed;
  status: string;
  system: System;
}

interface System {
  squawk?: any;
  updated: number;
}

interface Speed {
  horizontal: number;
  isGround: number;
  vspeed: number;
}

export interface Geography {
  altitude: number;
  direction: number;
  latitude: number;
  longitude: number;
}

interface Flight {
  iataNumber: string;
  icaoNumber: string;
  number: string;
}

interface Airline {
  iataCode: string;
  icaoCode: string;
}

interface Aircraft {
  iataCode: string;
  icao24: string;
  icaoCode: string;
  regNumber: string;
}

/// Airports
// req
export interface AirportsReqParams {
  airportId: string;
  codeIataAirport: string;
  codeIso2Country: string;
}

// res
export type AirportsRes = FlightLabsResponse<Airport[]>;

export interface Airport {
  GMT: string;
  airportId: number;
  codeIataAirport: string;
  codeIataCity: string;
  codeIcaoAirport: string;
  codeIso2Country: string;
  geonameId: string;
  latitudeAirport: number;
  longitudeAirport: number;
  nameAirport: string;
  nameCountry: string;
  phone: string;
  timezone: string;
}
