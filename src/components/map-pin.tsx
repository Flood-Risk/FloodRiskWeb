"use client";

import type { FindOneFloodRiskAreaResponse } from "@/features/find-one-flood-risk-area";
import { floodRiskAreaStore } from "@/stores/flood-risk-area-store";
import { mapStore } from "@/stores/map-store";
import { sideBarStore } from "@/stores/side-bar-store";
import { Marker } from "@react-google-maps/api";
import { observer } from "mobx-react-lite";
import { useEffect, useState, type ReactElement } from "react";

type MapPinProps = FindOneFloodRiskAreaResponse;

export const MapPin = observer((props: MapPinProps): ReactElement => {
  const [pinPosition, setPinPosition] = useState({ lat: 0, lng: 0 });

  const handlePinClick = (): void => {
    floodRiskAreaStore.setCurrentId(props.id);

    sideBarStore.setActionType("READ_ONE");

    mapStore.zoomToLocation(pinPosition.lat, pinPosition.lng);
  };

  useEffect(() => {
    setPinPosition({
      lat: parseFloat(props.latitude),
      lng: parseFloat(props.longitude),
    });
  }, [props.latitude, props.longitude]);

  return (
    <Marker
      position={pinPosition}
      animation={google.maps.Animation.DROP}
      clickable
      onClick={handlePinClick}
    />
  );
});
