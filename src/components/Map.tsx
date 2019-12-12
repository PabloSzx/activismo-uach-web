import { FC, useEffect, useState } from "react";
import { GoLocation } from "react-icons/go";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { useGeolocation, useSetState } from "react-use";

import { Box, IconButton } from "@chakra-ui/core";

const centerLocation: [number, number] = [-39.81442, -73.24579];
const chileanBounds: [[number, number], [number, number]] = [
  [-17.39, -84.2],
  [-60.2, -61.26],
];
const MapComponent: FC<{
  setLatitude: (lat: number) => void;
  setLongitude: (long: number) => void;
}> = ({ setLatitude, setLongitude }) => {
  const [userClicked, setUserClicked] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const [userPos, setUserPos] = useSetState({
    latitude: centerLocation[0],
    longitude: centerLocation[1],
  });

  const geoLocation = useGeolocation();

  useEffect(() => {
    if (
      !userClicked &&
      !userInteracted &&
      geoLocation.latitude &&
      geoLocation.longitude
    ) {
      setUserPos({
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
      });
      setTimeout(() => {
        setUserInteracted(false);
      }, 2000);
      setTimeout(() => {
        setUserInteracted(false);
      }, 5000);
    }
  }, [geoLocation, setUserPos, setUserInteracted, userClicked]);

  useEffect(() => {
    setLatitude(userPos.latitude);
    setLongitude(userPos.longitude);
  }, [userPos, setLatitude, setLongitude]);

  const position: [number, number] = [userPos.latitude, userPos.longitude];

  const [originalPosition, setOriginalPosition] = useState<[number, number]>([
    userPos.latitude,
    userPos.longitude,
  ]);

  useEffect(() => {
    if (geoLocation.latitude && geoLocation.longitude) {
      setOriginalPosition([geoLocation.latitude, geoLocation.longitude]);
    }
  }, [geoLocation, setOriginalPosition]);

  return (
    <>
      <IconButton
        opacity={
          position[0] !== originalPosition[0] ||
          position[1] !== originalPosition[1]
            ? 1
            : 0
        }
        size="xs"
        aria-label="Go Back Location"
        icon={GoLocation}
        onClick={() => {
          setUserPos({
            latitude: originalPosition[0],
            longitude: originalPosition[1],
          });
        }}
      />

      <Box size="sm">
        <Map
          animate
          center={position}
          zoom={16}
          maxBounds={chileanBounds}
          onClick={(ev: { latlng: { lat: number; lng: number } }) => {
            if (!userClicked) {
              setUserClicked(true);
            }
            setUserPos({
              latitude: ev.latlng.lat,
              longitude: ev.latlng.lng,
            });
          }}
          useFlyTo
          onZoom={() => {
            if (!userInteracted) {
              setUserInteracted(true);
            }
          }}
          onMove={() => {
            if (!userInteracted) {
              setUserInteracted(true);
            }
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>Ubicación seleccionada</Popup>
          </Marker>
        </Map>
      </Box>
    </>
  );
};

export default MapComponent;
