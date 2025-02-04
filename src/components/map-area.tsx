"use client";

import { Icon } from "@/assets/icons";
import { findAllFloodRiskAreas } from "@/features/find-all-flood-risk-areas";
import { floodRiskAreaStore } from "@/stores/flood-risk-area-store";
import { loadingStore } from "@/stores/loading-store";
import { mapStore } from "@/stores/map-store";
import { sideBarStore } from "@/stores/side-bar-store";
import { IconButton, Tooltip } from "@mui/material";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef, type ReactElement } from "react";
import { MapPin } from "./map-pin";

export const MapArea = observer((): ReactElement => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleFetchAllFloodRiskAreas = useCallback(async () => {
    loadingStore.wait();

    const { data } = await findAllFloodRiskAreas();

    loadingStore.stop();

    if (data) {
      const list = data.sort((a, b) => a.nome.toLowerCase().localeCompare(b.nome.toLowerCase()));

      floodRiskAreaStore.setList(list);
    }
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    handleFetchAllFloodRiskAreas();
  }, []);

  const handleMapLoad = (map: google.maps.Map): void => {
    mapRef.current = map;

    mapStore.setRef(mapRef.current);
  };

  return (
    <section data-test-id="map-area" className="flex-1">
      {isLoaded ? (
        <>
          <GoogleMap
            center={{
              lat: -14.235,
              lng: -51.9253,
            }}
            zoom={5}
            mapTypeId="terrain"
            onLoad={handleMapLoad}
            mapContainerClassName="w-full h-full"
          >
            {floodRiskAreaStore.list.map((area) => (
              <MapPin {...area} key={area.id} />
            ))}
          </GoogleMap>
          <Tooltip
            title={!sideBarStore.isOpen && "Abrir menu de opções"}
            placement="top-end"
            className="s-1440px:hidden"
          >
            <IconButton
              onClick={() => sideBarStore.toggle()}
              className="!absolute w-12 h-12 rounded-full translate-y-[-80px] translate-x-2 !bg-[#170C36] s-1440px:!hidden"
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
