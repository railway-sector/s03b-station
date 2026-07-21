import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import {
  b_renderer,
  chainage_renderer,
  label_chainage,
  label_stationp,
  norender,
  pier_access_label,
  popup,
  portalItems,
  prow_renderer,
} from "./uniqueValues";

//---------------------------------------------//
//              Other Layers                   //
//---------------------------------------------//
export const dateTable = new FeatureLayer({
  portalItem: portalItems("b2a118b088a44fa0a7a84acbe0844cb2"),
});

//---------------------------------------------//
//          Alignment Layers                   //
//---------------------------------------------//
//--- CHAINAGE LAYER ---//
export const chainageLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 2,
  title: "Chainage",
  elevationInfo: { mode: "relative-to-ground" },
  labelingInfo: [label_chainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainage_renderer,
  popupEnabled: false,
});

//--- PIER NUMBER POINT LAYER ---//
export const pierNoLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/3",
  labelingInfo: [pier_access_label],
  elevationInfo: { mode: "on-the-ground" },
  title: "Pier No",
  popupEnabled: false,
});

//--- PROW LAYER ---//
export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/5",
  layerId: 5,
  title: "PROW",
  renderer: prow_renderer,
  popupEnabled: false,
});

//--- STATION POINT LAYER ---//
export const stationLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 6,
  title: "Station",
  labelingInfo: [label_stationp],
  elevationInfo: { mode: "relative-to-ground" },
});
stationLayer.listMode = "hide";

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [chainageLayer, pierNoLayer, prowLayer], //stationLayer,
});

//---------------------------------------------//
//            Building Scene Layers            //
//---------------------------------------------//
export const buildingLayer = new BuildingSceneLayer({
  portalItem: portalItems("f9387908df044a8aba99608333bf9f86"),
  title: "FTI (LOD: 350)",
  legendEnabled: false,
});

//--- ARCHITECTURAL
export let floorsLayer: null | any;
export let wallsLayer: null | any;
export let roomsLayer: null | any;
export let genericLayer: null | any;
export let siteLayer: null | any;
export let stairsLayer: null | any;
export let stairsRailingLayer: null | any;

//--- STRUCTURAL
export let stFramingLayer: null | any;
export let stColumnLayer: null | any;
export let stFoundationLayer: null | any;
export let exteriorShellLayer: null | any;
export const sublayersAll: null | any = [];
export const sublayersAll_a: null | any = [];

let architecturalDiscipline: null | any;
let structuralDiscipline: null | any;

buildingLayer.when(() => {
  buildingLayer.allSublayers.forEach((layer: any) => {
    switch (layer.modelName) {
      case "FullModel":
        layer.visible = true;
        break;

      case "Overview":
        exteriorShellLayer = layer;
        exteriorShellLayer.visible = false;
        exteriorShellLayer.title = "Exterior Shell";
        exteriorShellLayer.renderer = norender;
        break;

      case "Architectural":
        architecturalDiscipline = layer;
        architecturalDiscipline.visible = true;
        architecturalDiscipline.title = "Architectural";
        break;

      case "Structural":
        structuralDiscipline = layer;
        structuralDiscipline.visible = true;
        structuralDiscipline.title = "Structural";
        break;

      case "Floors":
        floorsLayer = layer;
        floorsLayer.popupTemplate = popup;
        floorsLayer.title = "Floors";
        floorsLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "Walls":
        wallsLayer = layer;
        wallsLayer.popupTemplate = popup;
        wallsLayer.title = "Walls (not monitoring)";
        wallsLayer.renderer = norender;
        // sublayersAll.push({
        //   name: layer.modelName,
        //   layer: layer,
        // });
        break;

      case "GenericModel":
        genericLayer = layer;
        genericLayer.popupTemplate = popup;
        genericLayer.title = "GenericModel";
        genericLayer.renderer = norender;
        // sublayersAll.push({
        //   name: layer.modelName,
        //   layer: layer,
        // });
        break;

      case "Rooms":
        roomsLayer = layer;
        roomsLayer.popupTemplate = popup;
        roomsLayer.title = "Rooms (not monitoring)";
        roomsLayer.visible = false;
        roomsLayer.renderer = norender;
        // sublayersAll.push({
        //   name: layer.modelName,
        //   layer: layer,
        // });
        break;

      case "Site":
        siteLayer = layer;
        siteLayer.popupTemplate = popup;
        siteLayer.title = "Site";
        siteLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "Stairs":
        stairsLayer = layer;
        stairsLayer.popupTemplate = popup;
        stairsLayer.title = "Stairs (not monitoring)";
        stairsLayer.visible = false;
        stairsLayer.renderer = norender;
        // sublayersAll.push({
        //   name: layer.modelName,
        //   layer: layer,
        // });
        break;

      case "StairsRailing":
        stairsRailingLayer = layer;
        stairsRailingLayer.popupTemplate = popup;
        stairsRailingLayer.title = "StairsRailing (not monitoring)";
        stairsRailingLayer.visible = false;
        stairsRailingLayer.renderer = norender;
        // sublayersAll.push({
        //   name: layer.modelName,
        //   layer: layer,
        // });
        break;

      case "StructuralFraming":
        stFramingLayer = layer;
        stFramingLayer.popupTemplate = popup;
        stFramingLayer.title = "Structural Framing";
        stFramingLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralColumns":
        stColumnLayer = layer;
        stColumnLayer.popupTemplate = popup;
        stColumnLayer.title = "Structural Columns";
        stColumnLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralFoundation":
        stFoundationLayer = layer;
        stFoundationLayer.popupTemplate = popup;
        stFoundationLayer.title = "Structural Foundation";
        stFoundationLayer.renderer = b_renderer;
        sublayersAll.push({ name: layer.modelName, layer: layer });
        break;

      default:
        layer.visible = false;
    }
  });
});
