import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import Map, { MapOptions } from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import './OLMap.scss';

type OLMapCtx = { map: Map | null };
type OwnProps = { options: Partial<MapOptions> };

export const mapCtx = createContext<OLMapCtx>({ map: null });

export const OLMap: FC<PropsWithChildren<OwnProps>> = ({
  children,
  options
}) => {
  const mapElm = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const map = new Map({
      ...DEFAULT_MAP_OPTIONS,
      target: mapElm.current ?? DEFAULT_MAP_OPTIONS.target,
      ...options,
    });

    setMap(map);

    return () => {
      map?.dispose();
      setMap(null);
    };
  }, [options]);

  return (
    <mapCtx.Provider value={{ map }}>
      <div ref={mapElm} className="map"></div>
      {children}
    </mapCtx.Provider>
  );
};
export const DEFAULT_MAP_OPTIONS: MapOptions = {
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      }),
    }),
  ],
  view: new View({
    projection: 'EPSG:4326',
    center: [0, 0],
    zoom: 2,
  }),
};
