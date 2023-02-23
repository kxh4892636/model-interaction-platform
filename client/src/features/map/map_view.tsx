/*
 * @File: MapView component
 * @Author: xiaohano kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohano kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c)  by xiaohano kong, All Rights Reserved.
 */

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import useMapPositionStore from "../../stores/map_postion_store";
import useMapStore from "../../stores/map_store";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia3hoNDg5MjYzNiIsImEiOiJjbGFhcWYyNmcwNHF3M25vNXJqaW95bDZsIn0.ID03BpkSU7-I0OcehcrvlQ";

/**
 * @description create mapboxgl map and update map center position
 * @module Mapview
 * @author xiaohan kong
 * @export module: Mapview
 */
const MapView = () => {
  // NOTE 如何创建 mapbox map 对象
  const mapContainerRef = useRef<HTMLDivElement>(document.createElement("div"));
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const setMap = useMapStore((state) => state.setMap);
  const position = useMapPositionStore((state) => state.position);
  const setPosition = useMapPositionStore((state) => state.setPosition);

  useEffect(() => {
    // init map
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [position[0], position[1]],
      zoom: position[2],
    });
    setMap(mapRef.current);

    // update map center position
    mapRef.current.on("move", () => {
      setPosition([
        // NOTE ts ! 和 ? 的使用
        Number(mapRef.current!.getCenter().lng.toFixed(4)),
        Number(mapRef.current!.getCenter().lat.toFixed(4)),
        Number(mapRef.current!.getZoom().toFixed(2)),
      ]);
    });
  });

  return <div ref={mapContainerRef} style={{ height: "100%" }} className="map-container" />;
};

export default MapView;
