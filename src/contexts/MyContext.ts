import { createContext } from "react";

type MyDropdownContextType = {
  chartPanelwidth: any;
  chartPanelTabName: any;
  updateChartPanelwidth: any;
  updateChartPanelTabName: any;
};

const initialState = {
  chartPanelwidth: undefined,
  chartPanelTabName: undefined,
  updateChartPanelwidth: undefined,
  updateChartPanelTabName: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
