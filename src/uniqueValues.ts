import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import { toAsofdate } from "./query";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";

//----------------------------------------------//
//              portalItem                      //
//----------------------------------------------//
const portalItem_url = {
  url: "https://gis.railway-sector.com/portal",
};

export const portalItems = (id: any) => {
  return {
    id: id,
    portal: portalItem_url,
  };
};

//----------------------------------------------//
//           Chart Parameters                   //
//----------------------------------------------//
export const primaryLabelColor = "#d1d5db";
export const valueLabelColor = "#d1d5db";

//---------------------------------------------//
//         Time-Slider Parameter               //
//---------------------------------------------//
export const ts_field_q: any = [
  { datename: "Planned Completion Date", datefield: "finish_plan" },
  { datename: "Actual Start Date", datefield: "start_actual" },
  { datename: "Actual Completion Date", datefield: "finish_actual" },
];

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- PROW LAYER ---//
export const prow_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "2px",
  }),
});

//--- STATION POINT LAYER ---//
export const label_stationp = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: "#d4ff33" },
        size: 13,
        halo: { color: "black", size: 0.5 },
        font: { family: "Ubuntu Mono" },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 150,
      minWorldLength: 120,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: "white",
      size: 0.7,
      border: { color: "grey" },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: 'DefaultValue($feature.Station, "no data")',
  },
});

//--- CHAINAGE LAYER ---//
export const label_chainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: { size: 15, weight: "bold" },
  },
});

export const chainage_renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: { width: 0.2, color: "black" },
  }),
});

//--- PIER NUMBER POINT LAYER ---//
export const pier_access_label = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: valueLabelColor },
        size: 10,
        halo: { color: "black", size: 1 },
        font: { family: "Ubuntu Mono" },
      }),
    ],
    verticalOffset: {
      screenLength: 40,
      maxWorldLength: 100,
      minWorldLength: 40,
    },
    callout: {
      type: "line",
      size: 0.7,
      color: "white",
      border: { color: "grey" },
    },
  }),
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  labelPlacement: "above-center",
});

//------------------------------//
//        Parameters            //
//------------------------------//
export const b_type_f = "Types";
export const status_f = "Status";
export const category_f = "Category";
export const building_f = "Name";
export const location_f = "Component";

export const status_q: any = [
  {
    value: 1,
    status: "incomp",
    label: "To be Constructed",
    color: "#000000",
    rgb: [225, 225, 225, 0.1],
  },
  {
    value: 2,
    status: "ongoing",
    label: "Under Construction",
    color: "#f7f7f7ff",
    rgb: [211, 211, 211, 0.5],
  },
  {
    value: 3,
    status: "delayed",
    label: "Delayed",
    color: "#FF0000",
    rgb: [255, 0, 0, 0.8],
  },
  {
    value: 4,
    status: "comp",
    label: "Completed",
    color: "#0070ff",
    rgb: [0, 112, 255, 0.8],
  },
];

export const norender = new SimpleRenderer({
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: [255, 255, 155, 0.3], colorMixMode: "replace" },
        edges: new SolidEdges3D({ color: [255, 255, 155, 0.3] }),
      }),
    ],
  }),
});

const b_uniqueV = status_q.map((f: any) => {
  return {
    value: f.value,
    symbol: new MeshSymbol3D({
      symbolLayers: [
        new FillSymbol3DLayer({
          material: { color: f.rgb, colorMixMode: "replace" },
          edges: new SolidEdges3D({ color: [225, 225, 225, 0.3] }),
        }),
      ],
    }),
  };
});

export const b_renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: b_uniqueV,
});

const highlight = (value: unknown) =>
  `<span style="color: #eaeaea; font-weight: bold">${value}</span>`;

const customContent = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    const attrs = event.graphic.attributes;

    const status = event.graphic.attributes[status_f];
    const category = event.graphic.attributes["Category"];
    const component = event.graphic.attributes["Component"];
    const end_date = toAsofdate(new Date(attrs["finish_actual"]));

    return `
    <div style='line-height: 1.7'>
      <ul><li>Status: ${highlight(status)}</li>
      <li>Category: ${highlight(category)}</li>
      <li>Component: ${highlight(component ?? "")}</li>
      <li>End Date: ${highlight(end_date ?? "")}</li>
      </ul>
    </div>
              `;
  },
});

export const popup = new PopupTemplate({
  title: "<div style='color: #eaeaea'><b>{Types}</b></div>",
  lastEditInfoEnabled: false,
  content: [customContent],
});

//------------------------------//
//    Underground structures    //
//------------------------------//
export const u_types_q = [
  { value: "D-Wall", category: "D-Wall", modelName: "Site" },
  {
    value: "Underground Slab",
    category: "Slab",
    modelName: "StructuralFoundation",
  },
  {
    value: "Underground Piles",
    category: "Pile",
    modelName: "StructuralColumns",
  },
];

//------------------------------//
//    Aboveground structures    //
//------------------------------//
export const a_types_q = [
  {
    value: "Foundation",
    category: "Foundation",
    modelName: "StructuralFoundation",
  },
  {
    value: "Piles",
    category: "Piles",
    modelName: "StructuralColumns",
  },
  {
    value: "Roof",
    category: "Roof",
    modelName: "StructuralFraming",
  },
  {
    value: "Beam",
    category: "Beams",
    modelName: "StructuralFraming",
  },
];

//---------------------------------------------//
//             Layer List                      //
//---------------------------------------------//
export async function defineActions(event: any) {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = { content: "legend", open: true };
  }
  item.title === "Chainage" ||
  item.title === "Pier No" ||
  item.title === "Viaduct" ||
  item.title === "Exterior Shell" ||
  item.title === "GenericModel" ||
  item.title === "Rooms (not monitoring)" ||
  item.title === "Walls (not monitoring)" ||
  item.title === "StairsRailing (not monitoring)" ||
  item.title === "Stairs (not monitoring)"
    ? // item.title === "Walls (not monitoring)"
      (item.visible = false)
    : (item.visible = true);
}
