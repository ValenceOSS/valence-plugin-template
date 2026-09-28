import { definePlugin } from '@ValenceSDK/host/definePlugin';
import { actOnHello } from './actOnHello';
import { renderHello } from './renderHello';

definePlugin({
  pages: {
    hello: { render: renderHello, act: actOnHello },
  },
});
