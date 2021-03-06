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
export const MATSIM_ADD_PLACEHOLDER_LAYERS = "MATSIM_ADD_PLACEHOLDER_LAYERS";

export const MATSIM_ADD_SOURCE = "MATSIM_ADD_SOURCE";
export const MATSIM_ADD_LAYER = "MATSIM_ADD_LAYER";
export const MATSIM_SET_BASE_LAYER = "MATSIM_SET_BASE_LAYER";
export const MATSIM_SET_HIGHLIGHT_LAYER = "MATSIM_SET_HIGHLIGHT_LAYER";
export const MATSIM_SET_SELECTED_DISRUPTION_LAYER =
  "MATSIM_SET_SELECTED_DISRUPTION_LAYER";
export const MATSIM_SET_DISRUPTION_LAYER = "MATSIM_SET_DISRUPTION_LAYER";
export const MATSIM_ADD_DISRUPTION = "MATSIMATSIM_ADD_DISRUPTION";
export const MATSIM_SELECT_LINK = "MATSIM_SELECT_LINK";
export const MATSIM_DESELECT_LINK = "MATSIM_DESELECT_LINK";

// simulation setup/playthrough
export const MATSIM_SAVE_CONFIG = "MATSIM_SAVE_CONFIG";
export const MATSIM_SETTINGS_VIS = "MATSIM_SETTINGS_VIS";

export const SELECT_FIRE = "SELECT_FIRE";
export const CLEAR_FIRE = "CLEAR_FIRE";

export const SELECT_POPULATION = "SELECT_POPULATION";
export const CLEAR_POPULATION = "CLEAR_POPULATION";
export const POPULATION_SET_OPACITY = "POPULATION_SET_OPACITY";

export const POP_SET_ACTIVITIES = "POP_SET_ACTIVITIES";
export const POP_SET_ACTIVITY_COLOR = "POP_SET_ACTIVITY_COLOR";
export const POP_ADD_SOURCE = "POP_ADD_SOURCE";
export const POP_ADD_LAYER = "POP_ADD_LAYER";

export const PHOENIX_ADD_SOURCE = "PHOENIX_ADD_SOURCE";
export const PHOENIX_ADD_LAYER = "PHOENIX_ADD_LAYER";
export const PHOENIX_SET_OPACITY = "PHOENIX_SET_OPACITY";
export const PHOENIX_TIME_STEP = "PHOENIX_TIME_STEP";

export const DRAW_SMOKE = "DRAW_SMOKE";
export const EMBER_ADD_SOURCE = "EMBER_ADD_SOURCE";
export const EMBER_ADD_LAYER = "EMBER_ADD_LAYER";
export const EMBER_SET_OPACITY = "EMBER_SET_OPACITY";
export const CLEAR_SMOKE = "CLEAR_SMOKE";

// used to trigger pitch change, and 3D fire
export const TOGGLE_3D = "TOGGLE_3D";
