"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatLargeNumber } from "@/lib/utils/format";

interface CountyMapProps {
  countyName: string;
  totalCountySpending: number;
  countyFips: string;
}

// Dynamically import Leaflet to avoid SSR issues
function CountyMapInner({ countyName, totalCountySpending, countyFips }: CountyMapProps) {
  const [MapContainer, setMapContainer] = useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [GeoJSON, setGeoJSON] = useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [TileLayer, setTileLayer] = useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Dynamic imports for Leaflet (avoids SSR window issues)
      const L = await import("leaflet");
      const RL = await import("react-leaflet");
      await import("leaflet/dist/leaflet.css");

      // Load GeoJSON
      const geo = (await import("@/data/tx-counties.json")).default;

      if (!cancelled) {
        // Fix default marker icons
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMapContainer(() => RL.MapContainer as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setGeoJSON(() => RL.GeoJSON as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTileLayer(() => RL.TileLayer as any);
        setGeoData(geo as unknown as GeoJSON.FeatureCollection);
        setLoaded(true);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (!loaded || !MapContainer || !GeoJSON || !TileLayer || !geoData) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-charcoal/30">
        Loading map...
      </div>
    );
  }

  const countyNameUpper = countyName.toUpperCase();

  function style(feature: GeoJSON.Feature | undefined) {
    const name = (feature?.properties?.NAME || "").toUpperCase().replace(" COUNTY", "");
    const isTarget = name === countyNameUpper;
    return {
      fillColor: isTarget ? "#003f87" : "#e2e8f0",
      weight: isTarget ? 2 : 0.5,
      opacity: 1,
      color: isTarget ? "#003f87" : "#94a3b8",
      fillOpacity: isTarget ? 0.5 : 0.1,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onEachFeature(feature: GeoJSON.Feature, layer: any) {
    const name = (feature.properties?.NAME || "").replace(" County", "");
    layer.bindTooltip(name, {
      sticky: true,
      className: "font-sans text-sm",
    });
  }

  return (
    <MapContainer
      center={[31.5, -99.5]}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: "320px", width: "100%", borderRadius: "12px" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={geoData}
        style={style}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}

export function CountyMap(props: CountyMapProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="py-8"
    >
      <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">
        {props.countyName} County on the Map
      </h2>
      <p className="text-sm text-charcoal/50 mb-4">
        Total state spending in {props.countyName} County: {formatLargeNumber(props.totalCountySpending)}
      </p>
      <CountyMapInner {...props} />
    </motion.section>
  );
}
