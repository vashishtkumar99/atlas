# Atlas

Your life, mapped. A travel journal that feels like a storybook — a spinning Earth, a digital passport with gold stamps, and every journey drawn on your map.

Built with Expo (React Native), so one codebase runs on iPhone and Android with a real native feel.

## See it on your phone (5 minutes)

1. **Install Node.js** — download from https://nodejs.org (the LTS version).
2. **Install the Expo Go app** on your iPhone (App Store) or Android (Play Store).
3. Open a terminal in this folder and run:

```
npm install
npx expo start
```

4. A QR code appears in the terminal. Scan it with your iPhone camera (or inside Expo Go on Android). Atlas opens on your phone.

If npm complains about package versions, run `npx expo install --fix` and start again.

## Put it on GitHub

**Easy way (no terminal):**
1. Go to https://github.com and sign in.
2. Click the **+** in the top right → **New repository**. Name it `atlas`. Keep it private if you want. Create it.
3. On the empty repo page, click **uploading an existing file**.
4. Drag this whole folder's contents in (everything except `node_modules` — that folder is huge and gets rebuilt by `npm install`).
5. Click **Commit changes**. Done.

**Terminal way (better for ongoing work):**
```
git init
git add .
git commit -m "Atlas v1 — home, passport, transport"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/atlas.git
git push -u origin main
```
(Create the empty repo on github.com first, then swap in your username.)

The `.gitignore` file already keeps `node_modules` out, so the terminal way skips it automatically.

## What's inside

```
App.js                        the shell: fonts, light/dark, tabs, modals
app.json                      app name, icon, splash
assets/                       Atlas logo (icon, splash, android icon)
src/
  theme.js                    sage color palettes + type styles
  data/
    geo.js                    real Earth coastlines (validated) + your cities
    demo.js                   demo trips, stamps, badges, search data
  components/
    AtlasMark.js              the logo mark
    Globe.js                  the interactive spinning Earth
    Icons.js                  drawn line icons (no emojis)
    bits.js                   cards, chips, skylines, memory postcards
    modals.js                 search, add-a-trip sheet, city detail page
  screens/
    HomeScreen.js
    PassportScreen.js
    TransportScreen.js
```

## What's real vs demo

The design, navigation, globe, animations, and add-a-trip flow are real. The trips, stats, and search results are demo data — the next step is saving trips to the device (and later iCloud/accounts). Social features are planned for v2.
