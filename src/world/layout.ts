/** Where each region of the world lives. Regions are far apart so only one is ever visible. */
export const INSIDE_Y = -100;
export const STATION_GAP = 14;
export const LOG_X = 80;
export const STACK_X = 160;

export const stationZ = (k: number) => -k * STATION_GAP;
/** Devices alternate sides so the card can sit opposite. */
export const stationSide = (k: number) => (k % 2 === 0 ? 1 : -1);
