import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { Coordinate } from 'ol/coordinate';
import { createPortal } from 'react-dom';
import { mapCtx } from '../OLMap/OLMap';
import './OLPopup.scss';

type OwnProps = {
  name: string;
  //   coordinate: Coordinate;
  targetWindow?: Window;
  className?: string;
};

export const OLPopup: FC<PropsWithChildren<OwnProps>> = ({
  name,
  //   coordinate,
  targetWindow,
  className,
  children,
}) => {
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const popupCon = useRef<HTMLDivElement | null>(null);
  const { map } = useContext(mapCtx);

  useEffect(() => {
    if (!map || !popupCon.current) return;

    const ovl = new Overlay({
      element: popupCon.current,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    setOverlay(ovl);

    map.addOverlay(ovl);

    return () => {
      setOverlay(null);
      map.removeOverlay(ovl);
    };
  }, [className, map, name, targetWindow]);

  //   useEffect(() => {
  //     overlay?.setPosition(coordinate);
  //   }, [overlay, coordinate]);

  useEffect(() => {
    if (!map) return;
    map?.on('singleclick', function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      if (!feature) return;
      const center = (feature?.getGeometry() as any)?.flatCoordinates;
      overlay?.setPosition(center);

      map.getView().animate({
        center,
        duration: 500,
        zoom: 8,
      });
    });
  }, [map, overlay]);

  return (
    <div ref={popupCon} id={name} className={`my-popup ${className}`}>
      {children}
    </div>
  );
};
