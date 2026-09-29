import { SurfaceSchema } from '@ValenceSDK/surface/SurfaceSchema';
import { fakeValence } from './testing/fakeValence';
import { actOnHello } from './actOnHello';
import { renderHello } from './renderHello';

const contextFor = (valence: ReturnType<typeof fakeValence>['valence']) => ({
  valence,
  viewer: { profileId: 'p1', isAdmin: false, nodes: [] },
  subject: null,
});

describe('the hello page', () => {
  it('is a page Valence can draw, and counts each visit', async () => {
    const { valence, stored } = fakeValence();

    SurfaceSchema.parse(await renderHello(contextFor(valence)));
    await renderHello(contextFor(valence));

    expect(stored.get('visits:p1')).toEqual({ count: 2, name: '' });
  });

  it('greets somebody by the name they saved', async () => {
    const { valence } = fakeValence();
    const page = await actOnHello(contextFor(valence), {
      action: { id: 'save' },
      fields: { name: '  Marques ' },
    });

    expect(page.blocks[0]).toEqual({ type: 'heading', text: 'Hello, Marques!' });
  });

  it('forgets everything when asked', async () => {
    const { valence, stored } = fakeValence();

    await actOnHello(contextFor(valence), { action: { id: 'save' }, fields: { name: 'Marques' } });
    await actOnHello(contextFor(valence), { action: { id: 'reset' }, fields: {} });

    expect(stored.get('visits:p1')).toEqual({ count: 1, name: '' });
  });
});
