// Game reference data for the hypercube calculator, loaded at runtime from the
// external game-data service instead of a bundled data file. The service
// publishes canonical Niantic stats as JSON; we adapt only the slice the
// Calculator needs into the INGRESS_ITEMS shape it already expects:
//   INGRESS_ITEMS.STATS_POWERCUBE["8"].XM  - L8 Power Cube XM capacity
//   INGRESS_ITEMS.STATS_HYPER[level].XM    - Hypercube XM capacity at agent level
//
// The endpoint is CORS-enabled (access-control-allow-origin: *), so the static
// site can fetch it directly from the browser.
const GAME_DATA_URL = "https://legendre-web-production.up.railway.app/reference/game.json";

// Populated by loadGameData() before the UI calculates. Null until then; calc()
// guards on it so an early input event can't run against missing data.
let INGRESS_ITEMS = null;

// Reshape the service's game.json into the legacy INGRESS_ITEMS structure:
//   game.items.power_cube.capacity_xm_by_level -> STATS_POWERCUBE
//   game.levels[].hypercube_capacity           -> STATS_HYPER (keyed by level)
function adaptGameData(game) {
	const STATS_POWERCUBE = {};
	const powerCubeXM = game.items.power_cube.capacity_xm_by_level;
	Object.keys(powerCubeXM).forEach(level => {
		STATS_POWERCUBE[level] = { Level: Number(level), XM: powerCubeXM[level] };
	});

	const STATS_HYPER = {};
	game.levels.forEach(entry => {
		STATS_HYPER[String(entry.level)] = { Level: entry.level, XM: entry.hypercube_capacity };
	});

	return { STATS_POWERCUBE, STATS_HYPER };
}

async function loadGameData() {
	const response = await fetch(GAME_DATA_URL);
	if (!response.ok) {
		throw new Error(`Game data service returned HTTP ${response.status}`);
	}
	INGRESS_ITEMS = adaptGameData(await response.json());
}
