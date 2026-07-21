import "@esri/calcite-components/dist/components/calcite-tabs";
import "@esri/calcite-components/dist/components/calcite-tab";
import "@esri/calcite-components/dist/components/calcite-tab-nav";
import "@esri/calcite-components/dist/components/calcite-tab-title";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import { use, useEffect, useState } from "react";
import { buildingLayer } from "../layers";

// import LotChart from "./LotChart";
import "../index.css";
import ChartAboveground from "./ChartAboveground";
import { MyContext } from "../contexts/MyContext";
import ChartUnderground from "./ChartUnderground";

function MainChart() {
  const { updateChartPanelTabName, chartPanelTabName } = use(MyContext);
  const [buildingLayerLoaded, setBuildingLayerLoaded] = useState<any>(); // 'loaded'

  useEffect(() => {
    buildingLayer.load().then(() => {
      setBuildingLayerLoaded(buildingLayer.loadStatus);
    });
  }, []);

  return (
    <>
      <calcite-tabs
        style={{
          width: "550px",
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          borderColor: "#555555",
        }}
        slot="panel-end"
        layout="center"
        scale="l"
      >
        <calcite-tab-nav
          slot="title-group"
          id="thetabs"
          oncalciteTabChange={(event: any) =>
            updateChartPanelTabName(event.srcElement.selectedTitle.className)
          }
        >
          <calcite-tab-title className="UG">Underground</calcite-tab-title>
          <calcite-tab-title className="ATG">Aboveground</calcite-tab-title>
        </calcite-tab-nav>

        <calcite-tab>
          {buildingLayerLoaded === "loaded" && chartPanelTabName === "UG" && (
            <ChartUnderground />
          )}
        </calcite-tab>
        <calcite-tab>
          {buildingLayerLoaded === "loaded" && chartPanelTabName === "ATG" && (
            <ChartAboveground />
          )}
        </calcite-tab>
      </calcite-tabs>
    </>
  );
}

export default MainChart;
