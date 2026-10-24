# Valence plugin template

A starting point for a [Valence](https://github.com/ValenceOSS/Valence) plugin: a page that
remembers your name and counts your visits, and a theme. Press **Use this template** to make it
yours.

## How a Valence plugin works

A plugin runs on the Valence server, never in an app, in a sandbox that has no `require`, no
`process`, no `fetch` and no files. Everything it can do is on the `valence` object handed to each
handler, and each of those calls is checked against the permissions in your `manifest.json`, which
an administrator sees and accepts before installing.

A plugin does not draw anything. It returns a **surface**: a list of Valence's own building blocks
(headings, text, rows, buttons, toggles, text fields, lists and so on). The web, phone and TV apps
each draw those with their own components, so your page looks at home everywhere. When somebody
presses a button, Valence calls your `act` handler on the server with the action and the page's
fields, and you return the page again.

## 1. Make it yours

Edit `manifest.json`:

- `id`: lower-case, with dashes, unique to your plugin.
- `name`, `description`, `author`.
- `permissions`: only what you need. This template asks for 100 KB of storage and nothing else.
- `contributes`: your pages (`placement` is `account` or `admin`), panels on a title, album,
  artist or playlist page, themes, schedules and events.

## 2. Write it

`src/plugin.ts` names the handlers:

```ts
definePlugin({
  pages: {
    hello: { render: renderHello, act: actOnHello },
  },
});
```

`src/renderHello.ts` returns the page. `src/actOnHello.ts` handles its buttons. Read anything you
stored back through a schema, as `src/readVisits.ts` does, because storage returns whatever was
saved.

## 3. Test it

```sh
pnpm install
pnpm test
```

The SDK, `@valence/plugin-sdk`, comes straight from the Valence repository, pinned to one commit in
`package.json`, and `pnpm-lock.yaml` holds the rest to exact versions, so an install gives you what
was tested. To move to a newer SDK, put a newer commit of `ValenceOSS/Valence` in its place and run
`pnpm install`.

`src/testing/fakeValence.ts` is a stand-in `valence`: storage is kept in memory, the web answers as
your test says, and every method is a Vitest mock.

## 4. Build and pack it

```sh
pnpm build
```

That bundles `src/plugin.ts` into `dist/plugin.js` and packs `packages/hello-valence-0.1.0.vplugin`.
The `valence-plugin` command it builds can also sign a package and make a key:

```sh
pnpm valence-plugin keygen my-key --out keys
pnpm valence-plugin sign packages/hello-valence-0.1.0.vplugin --key keys/my-key.pem
```

## 5. Install it

In Valence, go to **Admin → Plugins → Install from a file** and choose your `.vplugin`, with its
`.sig` if you signed it. A package that isn't signed by Valence, or by a key the server's
administrator trusts, is marked unsigned, and Valence asks you to confirm before installing it.
Pages you contribute to `account` appear in each person's account area.

## Going further

The full guide, covering every permission, host method and building block, is at
[docs.getvalence.app/plugins/getting-started](https://docs.getvalence.app/plugins/getting-started).
The official plugins, for anime lists, Trakt, ListenBrainz and playlist imports, are in
[valence-plugins](https://github.com/ValenceOSS/valence-plugins).
