import type { ValenceHost } from '@ValenceSDK/host/ValenceHost';
import type { Visits } from './VisitsSchema';
import { VisitsSchema } from './VisitsSchema';

/**
 * What the plugin remembers about somebody. Storage hands back whatever was saved, so it is read
 * through a schema rather than trusted.
 *
 * @param valence - The host.
 * @param profileId - Whose visits.
 * @returns Their visits and name, or a fresh start.
 */
const readVisits = async (valence: ValenceHost, profileId: string): Promise<Visits> => {
  const read = VisitsSchema.safeParse(await valence.storage.get(`visits:${profileId}`));

  return read.success ? read.data : { count: 0, name: '' };
};

export { readVisits };
