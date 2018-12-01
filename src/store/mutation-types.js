// mutation-types.js
// Represents global mutation triggers that are used throughout the application

export const START_LOADING = "START_LOADING";
export const DONE_LOADING = "DONE_LOADING";

export const SET_MAP_INSTANCE = "SET_MAP_INSTANCE";

export const SET_DRAW_INSTANCE = "SET_DRAW_INSTANCE";
export const SET_MAPBOX_STYLE = "SET_MAPBOX_STYLE";
export const SETTINGS_VISIBILITY = "SETTINGS_VISIBILITY";

export const SELECT_REGION = "SELECT_REGION";
export const CLEAR_REGION = "CLEAR_REGION";
export const FLY_TO = "FLY_TO";
export const SET_FIRST_SYMBOL_LAYER = "SET_FIRST_SYMBOL_LAYER";

export const MATSIM_ADD_SOURCE = "MATSIM_ADD_SOURCE";
export const MATSIM_ADD_LAYER = "MATSIM_ADD_LAYER";
export const MATSIM_SET_BASE_LAYER = "MATSIM_SET_BASE_LAYER";
export const MATSIM_SET_HIGHLIGHT_LAYER = "MATSIM_SET_HIGHLIGHT_LAYER";

// used to trigger pitch change, and 3D fire
export const TOGGLE_3D = "TOGGLE_3D";
