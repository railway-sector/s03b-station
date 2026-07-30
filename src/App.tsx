import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import MainChart from "./components/MainChart";
import UndergroundSwitch from "./components/UndergroundSwitch";
import { useCallback, useEffect, useState } from "react";
import { MyContext } from "./contexts/MyContext";
import { authenticate } from "./autho";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ts_field_q } from "./uniqueValues";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "hNWIzMYMdl2VFCDH");
  }, []);

  const [chartPanelTabName, setChartPanelTabName] = useState<any>("UG");
  const updateChartPanelTabName = (newTab: any) => {
    setChartPanelTabName(newTab);
  };

  const [newTsparam, setNewTsparam] = useState<any>(ts_field_q[0].datename);
  const updateNewTsparam = useCallback((newParam: any) => {
    setNewTsparam(newParam);
  }, []);

  return (
    <>
      {loggedInState && (
        <calcite-shell>
          <MyContext
            value={{
              chartPanelTabName,
              updateChartPanelTabName,
              newTsparam,
              updateNewTsparam,
            }}
          >
            <QueryClientProvider client={queryClient}>
              <ActionPanel />
              <UndergroundSwitch />
              <MapDisplay />
              <MainChart />
              <Header />
            </QueryClientProvider>
          </MyContext>
        </calcite-shell>
      )}
    </>
  );
}

export default App;
