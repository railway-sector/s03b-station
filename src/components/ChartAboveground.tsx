import { use, useEffect, useRef, useState } from "react";
import { stColumnLayer, sublayersAll, queryc2, chartstack_a } from "../layers";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { thousands_separators, zoomToLayer } from "../query";
import "@esri/calcite-components/dist/components/calcite-label";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import {
  buildingTypes_a,
  chart_colors,
  chartCategoryTypeField,
  statusArray,
  statusField,
  structureLocationField,
} from "../uniqueValues";
import { chartRenderer, resetAllLayers } from "../chartRenderer";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import { MyContext } from "../contexts/MyContext";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import { queryDefinitionExpression } from "../queryExpression";
import { useQuery } from "@tanstack/react-query";
import { legendSetter, rootSetter } from "../chartSetter";

// Draw chart
export default function ChartAboveground() {
  const { chartPanelTabName } = use(MyContext);
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();
  const highlightedSublayerView = useRef<any>(undefined);
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);
  const chartID = "stack-bar2";

  const { data } = useQuery<any>({
    queryKey: [chartPanelTabName, chartCategoryTypeField],
    queryFn: async () => {
      const sublayersArray = sublayersAll.map((item: any) => item.layer);

      queryc2.qValues = [chartPanelTabName];
      queryc2.qFields = [structureLocationField];

      queryDefinitionExpression({
        queryExpression: queryc2.queryExpression(),
        featureLayer: sublayersArray,
      });

      chartstack_a.qChart = queryc2.queryExpression();
      chartstack_a.layers = sublayersArray;
      chartstack_a.categoryTypes = buildingTypes_a;
      chartstack_a.categoryTypeField = chartCategoryTypeField;
      chartstack_a.statusState = [1, 2, 3, 4];
      const chartData = await chartstack_a.chartDataStackColumns();

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
  const chartPaddingRightIconLabelSpace = 10;

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

    chartRenderer({
      root: root,
      chart: chart,
      data: chartData,
      q1Value: chartPanelTabName,
      q1Field: structureLocationField,
      chartCategoryTypes: buildingTypes_a,
      chartCategoryFieldRevit: chartCategoryTypeField,
      statusTypename: ["Completed", "To be Constructed"],
      statusStatename: ["comp", "incomp"],
      statusArray: statusArray,
      statusField: statusField,
      seriesStatusColor: chart_colors,
      strokeColor: chartBorderLineColor,
      strokeWidth: chartBorderLineWidth,
      arcgisScene: arcgisScene,
      setSublayerViewFilter: setSublayerViewFilter,
      sublayersCollection: sublayersAll,
      highlightedSublayerView: highlightedSublayerView,
      chartPaddingRightIconLabelSpace: chartPaddingRightIconLabelSpace,
      new_chartIconSize: new_chartIconSize,
      new_axisFontSize: new_axisFontSize,
      legend: legend,
      updateChartPanelwidth: setChartPanelwidth,
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  //-- Reset clicked event in chart series
  useEffect(() => {
    // const sublayersArray = sublayersAll.map((item: any) => item.layer);
    if (sublayerViewFilter) {
      sublayerViewFilter.filter = new FeatureFilter({
        where: undefined,
      });

      highlightedSublayerView.current &&
        highlightedSublayerView.current.remove();
    }

    resetAllLayers({
      layers: sublayersAll,
      qExpression: `${structureLocationField} = '${chartPanelTabName}'`,
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
          style={{ marginTop: "10px", marginLeft: "15px" }}
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
            }}
          >
            ({thousands_separators(totaln)})
          </div>
        </dl>
      </div>

      <div
        id={chartID}
        style={{
          height: "61vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginRight: "10px",
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
          onClick={() =>
            setResetButtonClicked(resetButtonClicked === false ? true : false)
          }
        >
          Reset Chart Filter
        </calcite-button>
      </div>
    </>
  );
}
