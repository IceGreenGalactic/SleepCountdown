# 🍼 Sovetid (Nap Time) – Kindergarten PWA

### Sleep countdown for kindergarden

A simple, fast **Progressive Web App** for keeping track of children's nap times in kindergarten.  
Runs completely offline, stores data only in the device's **localStorage**, and can play sound + send local notifications when it's time to wake a child.


## 🧠 Why I built this

This app was created while I worked in a kindergarten, where we spent a lot of time manually calculating nap times and writing them down on paper.

I wanted to quickly create a simple tool that could actually be used in daily work, so I focused on building something fast, reliable, and easy to use — rather than over-engineering it.

The app replaced the manual paper-based system in my department and is still used in daily routines.


## ✨ Features

- Add / edit / delete children
- Set maximum nap duration per child (in minutes)
- Start nap "now" with one click
- Manual start (pick the exact time if staff forgot to start immediately)
- Live countdown until wake-up
- Clear overdue alerts with blinking border + sound
- Sound alarm (needs one-time activation on iOS/Android)
- Push-style notifications (requires permission)
- PWA: installable on homescreen, works offline
- Update banner when a new version is available


## 🤖 Use of AI in development

AI was an important part of my workflow in this project.

I used it to:
- explore possible implementations
- speed up development
- debug and improve logic

At the same time, I learned that AI needs clear context to be useful. Since this app is based on real kindergarten workflows, I had to carefully explain domain-specific details to get good results.

This helped me develop a more critical and structured way of working with AI, where I validate and adapt suggestions rather than relying on them directly.

## 🛠️ Technical choices

This project is built using:
- HTML
- CSS
- JavaScript

I intentionally chose a simple stack instead of frameworks like React, because the goal was to deliver a working solution quickly in a real-world environment.

The focus was on usability, performance, and reliability rather than complexity.

## 📚 What I learned

- How to build and ship a real-world solution quickly
- The importance of simplicity over complexity in practical environments
- How to use AI as a development tool, not just a shortcut
- How domain knowledge impacts technical solutions

## 🚀 Run locally

You can run this app in two simple ways:

1. **VSCode Live Server (easiest)**

   - Right-click `index.html` → **Open with Live Server**
   - The app will open in your browser, usually at `http://127.0.0.1:5500`

2. **npm http-server (manual)**

```bash
   # Install once
   npm i -g http-server

   # Start server in project folder
   http-server -p 5500

   # Open in browser
   http://127.0.0.1:5500
```

> Tip: disable the service worker during development to avoid cache issues.



## 🧩 Files

- **index.html**  
  Loads CSS + `app.js`, contains template + manual start dialog, includes `<audio>` element for the alarm.

- **app.js**  
  Main logic (state, rendering, naps, audio, notifications, dialogs).  
  Stores children data in `localStorage` under key `children.v1`.

- **styles/main.css**  
  Dark, mobile-first design.

- **manifest.webmanifest**  
  Defines app name, theme, and icons for PWA.

- **sw.js** (service worker)  
  Provides offline cache. Increase cache version when changing files.



## 🔔 Sound & Notifications

- **Sound:** Mobile browsers require a user click to "unlock" audio. Use the **Enable Sound** button once.
- **Notifications:** Click **Allow Notifications** and approve the browser prompt. The browser must support the `Notification` API.



## 🔐 Privacy & Legality

This app is **privacy-friendly** by design:

- All data is stored **only in the browser** (`localStorage`).
- No data is uploaded, synced, or transmitted anywhere.
- Works fully **offline**, no server is required.
- Clearing browser storage removes all data.

➡️ This means **no personal data ever leaves the device**, making it fully compliant for use in a kindergarten environment where children’s privacy must be protected.



## 🧪 Development tips

### Disable service worker during coding

In `app.js`, keep SW registration commented out:

```js
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./sw.js');
// }
```
# 📄 Disclaimer

This project is free to use and adapt for your kindergarten or personal needs.
Please do not sell or redistribute commercially without permission.
All data stays on the device (localStorage) and is never uploaded or shared.



## 📫 Contact

GitHub: [IceGreenGalactic](https://github.com/IceGreenGalactic)
LinkedIn: [Kristine Tyrholm](https://www.linkedin.com/in/kristine-tyrholm/)
