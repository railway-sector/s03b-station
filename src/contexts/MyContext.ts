import { createContext } from "react";

type MyDropdownContextType = {
  chartPanelTabName: any;
  updateChartPanelTabName: any;
};

const initialState = {
  chartPanelTabName: undefined,
  updateChartPanelTabName: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
