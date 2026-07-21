import { use, useEffect, useRef, useState } from "react";
import { stColumnLayer, sublayersAll, buildingLayer } from "../layers";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import {
  makeQuery,
  resetAllLayers,
  stackColumnChartData,
  stackColumnChartRender,
  thousands_separators,
  zoomToLayer,
} from "../query";
import "@esri/calcite-components/dist/components/calcite-label";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import {
  location_f,
  status_f,
  status_q,
  b_type_f,
  u_types_q,
} from "../uniqueValues";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import { MyContext } from "../contexts/MyContext";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import { queryDefinitionExpression } from "../queryExpression";
import { useQuery } from "@tanstack/react-query";
import { legendSetter, rootSetter } from "../chartSetter";
import ChartStackColumnRender from "chart-stack-column-render";
import ChartStackColumns from "chart-stack-column";

// Draw chart
export default function ChartUnderground() {
  const { chartPanelTabName } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [sublayerViewFilter, setSublayerViewFilter] = useState<SubLayerView>();
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);
  const chartID = "stack-bar";

  //--- Common qValues and qFields for QueryExpressionLayers class
  const queryc2 = makeQuery([chartPanelTabName], [location_f]);

  const sublayersArray = sublayersAll.map((item: any) => item.layer);

  const { data, isLoading } = useQuery<any>({
    queryKey: [chartPanelTabName, b_type_f],
    queryFn: async () => {
      queryDefinitionExpression({
        queryExpression: queryc2.queryExpression(),
        featureLayer: sublayersArray,
      });

      const chartData = await stackColumnChartData({
        colchart: new ChartStackColumns(),
        qChart: queryc2,
        categoryTypes: u_types_q,
        categoryTypeField: b_type_f,
        layers: sublayersArray,
        statusField: status_f,
        statusState: [1, 2, 3, 4],
      });

      zoomToLayer(stColumnLayer, arcgisScene);

      return {
        chartData: chartData[0] || [],
        totaln: chartData[1] || 0,
        perc: chartData[2] || 0,
      };
    },
    staleTime: Infinity,
  });
  const chartData = data?.chartData || [];
  const totaln = data?.totaln || 0;
  const perc_comp = data?.perc || 0;

  // Define parameters
  const marginTop = 0;
  const marginLeft = 0;
  const marginRight = 0;
  const marginBottom = 0;
  const paddingTop = 10;
  const paddingLeft = 5;
  const paddingRight = 5;
  const paddingBottom = 0;
  const chartBorderLineColor = "#00c5ff";
  const chartBorderLineWidth = 0.4;
  const chartPaddingRightIconLabel = 10;

  //-------------------------------------//
  //    Responsive Chart parameters      //
  //-------------------------------------//
  const new_fontSize = chartPanelwidth / 20;
  const new_valueSize = new_fontSize * 1.55;
  const new_chartIconSize = chartPanelwidth * 0.07;
  const new_axisFontSize = chartPanelwidth * 0.036;
  const new_imageSize = chartPanelwidth * 0.035;

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        scale: 1,
        height: am5.percent(100),
      }),
    );
    chartRef.current = chart;

    const legend = legendSetter({
      chart: chart,
      root: root,
      centerX: 50,
      centerY: 50,
      x: 60,
      y: 97,
      marginTop: 20,
      scale: 0.9,
      layout: root.horizontalLayout,
    });
    legendRef.current = legend;

    //-- Chart render
    const chartIconPositionX = 0;
    stackColumnChartRender({
      render: new ChartStackColumnRender(),
      revit: true,
      layers: sublayersAll,
      root,
      chart,
      data: chartData,
      buildingLayer: buildingLayer,
      qChart: queryc2,
      chartCategoryTypes: u_types_q,
      chartCategoryTypeField: b_type_f,
      statusTypename: ["Completed", "To be Constructed"],
      statusStatename: ["comp", "incomp"],
      statusArray: status_q,
      statusField: status_f,
      seriesStatusColor: status_q.map((c: any) => c.color),
      strokeColor: chartBorderLineColor,
      strokeWidth: chartBorderLineWidth,
      view: arcgisScene?.view,
      setLayerViewFilter: setSublayerViewFilter,
      new_chartIconSize,
      new_axisFontSize,
      chartIconPositionX,
      chartPaddingRightIconLabel,
      legend,
      updateChartPanelwidth: setChartPanelwidth,
    });
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartData, chartPanelTabName]);

  //-- Reset clicked event in chart series
  useEffect(() => {
    // const sublayersArray = sublayersAll.map((item: any) => item.layer);
    if (sublayerViewFilter) {
      sublayerViewFilter.filter = new FeatureFilter({
        where: undefined,
      });
    }

    resetAllLayers({
      layers: sublayersAll,
      qExpression: `${location_f} = '${chartPanelTabName}'`,
    });
  }, [resetButtonClicked]);

  const primaryLabelColor = "#9ca3af";
  const valueLabelColor = "#d1d5db";

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "3px",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Station_Structures_icon.svg"
          alt="Utility Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{
            marginTop: "10px",
            marginLeft: "15px",
            opacity: isLoading ? 0 : 1,
          }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
              marginRight: "25px",
            }}
          >
            TOTAL PROGRESS
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
            }}
          >
            {perc_comp} %
          </dd>
          <div
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}*0.5px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
              opacity: isLoading ? 0 : 1,
            }}
          >
            ({thousands_separators(totaln)})
          </div>
        </dl>
      </div>

      <div
        id={chartID}
        style={{
          height: "63vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginRight: "15px",
          opacity: isLoading ? 0 : 1,
        }}
      ></div>
      <div
        id="filterButton"
        style={{
          width: "50%",
          marginLeft: "30%",
          marginTop: "5%",
          // paddingTop: "10%",
        }}
      >
        <calcite-button
          iconEnd="reset"
          scale="s"
          onClick={() => setResetButtonClicked(!resetButtonClicked)}
        >
          Reset Chart Filter
        </calcite-button>
      </div>
    </>
  );
}
