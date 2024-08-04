"use client";

import { Icon } from "@/assets/icons";
import type { FindAllFloodRiskAreasResponse } from "@/features/find-all-flood-risk-areas";
import { findAllFloodRiskAreas } from "@/features/find-all-flood-risk-areas";
import { sideBarStore } from "@/stores/side-bar-store";
import { IconButton, Tooltip } from "@mui/material";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState, type ReactElement } from "react";
import { MapPin } from "./map-pin";

export const MapArea = observer((): ReactElement => {
  const [floodRiskAreas, setFloodRiskAreas] = useState<FindAllFloodRiskAreasResponse[]>([]);

  const handleFetchAllFloodRiskAreas = useCallback(async () => {
    const { data } = await findAllFloodRiskAreas();

    if (data) setFloodRiskAreas(data);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    handleFetchAllFloodRiskAreas();
  }, []);

  // center={{
  //   lat: floodRiskAreaStore.current
  //     ? parseFloat(floodRiskAreaStore.current.latitude)
  //     : -14.235,
  //   lng: floodRiskAreaStore.current
  //     ? parseFloat(floodRiskAreaStore.current.longitude)
  //     : -51.9253,
  // }}

  return (
    <section className="flex-1">
      {isLoaded ? (
        <>
          <GoogleMap
            center={{
              lat: -14.235,
              lng: -51.9253,
            }}
            zoom={5}
            mapTypeId="terrain"
            onClick={(ev) => {
              console.log(ev.latLng?.lat());
              console.log(ev.latLng?.lng());
            }}
            mapContainerClassName="w-full h-full"
          >
            {floodRiskAreas.map((area) => (
              <MapPin {...area} key={area.id} />
            ))}
          </GoogleMap>
          <Tooltip title={!sideBarStore.isOpen && "Abrir menu de opções"} placement="top-end">
            <IconButton
              onClick={() => sideBarStore.toggle()}
              className="!absolute w-12 h-12 rounded-full translate-y-[-80px] translate-x-2 !bg-[#170C36]"
            >
              {sideBarStore.isOpen ? (
                <Icon.KeyboardDoubleArrowLeft className="text-white" />
              ) : (
                <Icon.KeyboardDoubleArrowRight className="text-white" />
              )}
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <div className="w-full h-full" />
      )}
    </section>
  );
});
