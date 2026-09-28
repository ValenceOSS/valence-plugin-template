import type { SurfaceContext } from '@ValenceSDK/host/PluginDefinition';
import type { Surface } from '@ValenceSDK/surface/SurfaceSchema';
import { readVisits } from './readVisits';

/**
 * The plugin's page: counts the visit, greets whoever is looking, and asks what to call them.
 *
 * @param context - The host and who is looking.
 * @returns The page.
 */
const renderHello = async ({ valence, viewer }: SurfaceContext): Promise<Surface> => {
  const visits = await readVisits(valence, viewer.profileId);
  const count = visits.count + 1;

  await valence.storage.set(`visits:${viewer.profileId}`, { ...visits, count });

  return {
    title: 'Hello',
    blocks: [
      { type: 'heading', text: visits.name === '' ? 'Hello!' : `Hello, ${visits.name}!` },
      { type: 'text', text: `This is visit number ${count.toString()}.`, tone: 'muted' },
      {
        type: 'section',
        title: 'About you',
        children: [
          {
            type: 'textField',
            field: 'name',
            label: 'What should I call you?',
            value: visits.name,
          },
          { type: 'button', label: 'Save', action: { id: 'save' }, tone: 'primary' },
          {
            type: 'button',
            label: 'Start counting again',
            action: { id: 'reset', confirm: 'Forget your visits?' },
            tone: 'danger',
          },
        ],
      },
    ],
  };
};

export { renderHello };
