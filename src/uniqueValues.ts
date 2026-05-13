export const type_field = "Type";
export const status_field = "Status";
export const category_field = "Category";
export const building_field = "Name";
export const colorStatus = [
  [225, 225, 225, 0.1], // To be Constructed (white)
  [211, 211, 211, 0.5], // Under Construction
  [255, 0, 0, 0.8], // Delayed
  [0, 112, 255, 0.8], // Completed
];

//--- type definitions
export type StatusTypenamesType =
  | "To be Constructed"
  | "Under Construction"
  | "delayed"
  | "Completed";
export type StatusStateType = "comp" | "incomp" | "ongoing" | "delayed";
export type LayerNameType = "utility" | "viaduct" | "others";
export type TypeFieldType = "number" | "string";

// Media parameters
export const image_scales = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4];
export const img_size = 280;
export const timestamp_field = "timestamp";

// month
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//--- chart parameters
export const chart_colors = ["#000000", "#f7f7f7ff", "#FF0000", "#0070ff"];
export const structureLocationField = "Component"; // 'UG' or 'ATG'
export const chartCategoryTypeField = "Types";
export const statusField = "Status";
export const statusStateValues = [1, 2, 3, 4];

export const statusLabels = ["incomp", "ongoing", "delayed", "comp"];
export const statusValues = [1, 2, 3, 4];
export const statusArray = statusLabels.map((status: any, index: any) => {
  return Object.assign({
    status: status,
    value: statusValues[index],
  });
});

//------------------------------//
//    Underground structures    //
//------------------------------//
export const building_type_labels_u = ["D-Wall", "Slab", "Pile"];

//-- model names
export const sublayerModelNames_u = [
  "Site",
  "StructuralFoundation", // Floors
  "StructuralColumns",
  // "Floors",
];

export const building_type_values_u = [
  "D-Wall",
  "Underground Slab",
  "Underground Piles",
];
export const buildingTypes_u = building_type_labels_u.map(
  (label: any, index: any) => {
    return Object.assign({
      category: label,
      value: building_type_values_u[index],
      modelName: sublayerModelNames_u[index],
    });
  },
);

//------------------------------//
//    Aboveground structures    //
//------------------------------//
export const building_type_labels_a = ["Foundation", "Piles", "Roof", "Beams"];

//-- model names
export const sublayerModelNames_a = [
  "StructuralFoundation",
  "StructuralColumns",
  "StructuralFraming",
  "StructuralFraming",
];

export const building_type_values_a = ["Foundation", "Piles", "Roof", "Beam"];

export const buildingTypes_a = building_type_labels_a.map(
  (label: any, index: any) => {
    return Object.assign({
      category: label,
      value: building_type_values_a[index],
      modelName: sublayerModelNames_a[index],
    });
  },
);
