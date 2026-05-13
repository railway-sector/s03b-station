import { use, useEffect, useRef, useState } from "react";
import { stColumnLayer, sublayersAll, queryc2 } from "../layers";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { thousands_separators, zoomToLayer } from "../Query";
import "@esri/calcite-components/dist/components/calcite-label";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { chartDataStackColumns } from "../ChartDataGenerator";
import {
  buildingTypes_a,
  chart_colors,
  chartCategoryTypeField,
  statusArray,
  statusField,
  structureLocationField,
} from "../uniqueValues";
import { chartRenderer, resetAllLayers } from "../ChartRenderer";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import { MyContext } from "../contexts/MyContext";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import { queryDefinitionExpression } from "../QueryExpression";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// Draw chart
export default function ChartAboveground() {
  const { updateChartPanelwidth, chartPanelwidth, chartPanelTabName } =
    use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});

  const [chartData, setChartData] = useState<any>([]);
  const [percentCompleted, setPercentCompleted] = useState<number>(0);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();
  const highlightedSublayerView = useRef<any>(undefined);
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);
  const chartID = "stack-bar2";

  useEffect(() => {
    const sublayersArray = sublayersAll.map((item: any) => item.layer);

    queryc2.qValues = [chartPanelTabName];
    queryc2.qFields = [structureLocationField];

    queryDefinitionExpression({
      queryExpression: queryc2.queryExpression(),
      featureLayer: sublayersArray,
    });

    chartDataStackColumns({
      layers: sublayersArray,
      chartCategoryTypes: buildingTypes_a,
      chartCategoryField: chartCategoryTypeField,
      chartCategoryValueType: "string",
      statusState: [1, 2, 3, 4],
      statusField: statusField,
      qChart: queryc2.queryExpression(),
    }).then((response: any) => {
      setChartData(response[0]);
      setTotalCompleted(response[1]);
      setPercentCompleted(response[2]);
    });

    zoomToLayer(stColumnLayer, arcgisScene);
  }, []);

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
    maybeDisposeRoot(chartID);

    const root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

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

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        centerY: am5.percent(50),
        x: am5.percent(60),
        y: am5.percent(97),
        marginTop: 20,
        scale: 0.9,
        layout: root.horizontalLayout,
      }),
    );
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
      updateChartPanelwidth: updateChartPanelwidth,
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
            {percentCompleted} %
          </dd>
          <div
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}*0.5px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
            }}
          >
            ({thousands_separators(totalCompleted)})
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
