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
import { useEffect, useState } from "react";
import { MyContext } from "./contexts/MyContext";
import { authenticate } from "./autho";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

  return (
    <>
      {loggedInState && (
        <calcite-shell>
          <MyContext value={{ chartPanelTabName, updateChartPanelTabName }}>
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
