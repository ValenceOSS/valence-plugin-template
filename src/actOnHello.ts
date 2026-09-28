import type { SurfaceContext } from '@ValenceSDK/host/PluginDefinition';
import type { SurfaceActRequest } from '@ValenceSDK/surface/SurfaceActRequestSchema';
import type { Surface } from '@ValenceSDK/surface/SurfaceSchema';
import { readVisits } from './readVisits';
import { renderHello } from './renderHello';

/**
 * Does what somebody pressed on the page: saves the name they typed, or forgets their visits.
 *
 * @param context - The host and who pressed it.
 * @param request - What they pressed, and the page's fields.
 * @returns The page again.
 */
const actOnHello = async (
  context: SurfaceContext,
  request: SurfaceActRequest,
): Promise<Surface> => {
  const { valence, viewer } = context;
  const key = `visits:${viewer.profileId}`;

  if (request.action.id === 'save') {
    const name = request.fields['name'];
    const visits = await readVisits(valence, viewer.profileId);

    await valence.storage.set(key, {
      ...visits,
      name: typeof name === 'string' ? name.trim().slice(0, 40) : '',
    });
  }

  if (request.action.id === 'reset') {
    await valence.storage.delete(key);
  }

  return renderHello(context);
};

export { actOnHello };
