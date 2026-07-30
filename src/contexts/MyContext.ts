import { createContext } from "react";

type MyDropdownContextType = {
  chartPanelTabName: any;
  updateChartPanelTabName: any;
  newTsparam: any;
  updateNewTsparam: any;
};

const initialState = {
  chartPanelTabName: undefined,
  updateChartPanelTabName: undefined,
  newTsparam: undefined,
  updateNewTsparam: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
