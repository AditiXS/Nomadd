import { CITIES_WITH_INTRO } from '../data/cityConfigs';

/** After login/signup, route to cinematic intro when available. */
export function getPostAuthCityPath(city) {
  if (!city) return '/';
  const slug = city.toLowerCase();
  if (CITIES_WITH_INTRO.includes(slug)) {
    return `/intro/${slug}`;
  }
  return `/city/${slug}`;
}
