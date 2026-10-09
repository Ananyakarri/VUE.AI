# VUE.AI — StyleSense AI Virtual Try-On

StyleSense AI is a web-based virtual clothing try-on demo that lets users preview a clothing item in a camera view. The project includes a simple fashion-focused interface with clothing selection, camera controls, and supporting home, login, registration, and payment pages.

> **Project status:** Prototype/demo. The current clothing catalog contains an example T-shirt, and the login, registration, and payment pages should be treated as UI demonstrations unless backend integrations are added.

## Features

- **Virtual try-on interface** with a webcam view and canvas overlay.
- **Clothing selection** from a clothing catalog.
- **Category filters** for tops, bottoms, and dresses.
- **Camera controls** to start the camera, toggle mirroring, and take a photo.
- **Demo mode** so the interface can be explored before using the camera.
- **Responsive dark-themed UI** for desktop and smaller screens.
- **Supporting pages** for Home, Login, Register, and Payment.

## Tech Stack

- **HTML5** — page structure
- **CSS3** — styling and responsive layout
- **JavaScript** — interface behavior and camera interactions
- **Node.js + Express** — lightweight static-file server
- **MediaPipe Pose / Drawing Utils** — external scripts included for pose-related functionality

## Project Structure

```text
VUE.AI-main/
├── index.html          # Virtual try-on experience
├── home.html           # Home / welcome page
├── login.html          # Login UI
├── register.html       # Registration UI
├── payment.html        # Payment UI
├── style.css           # Shared styles
├── script.js           # Virtual try-on interactions
├── server.js           # Express static-file server
├── simple-server.js    # Minimal Node.js static server
├── tshirt.png          # Example clothing overlay image
├── package.json        # Node.js package configuration
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- A modern browser such as Chrome or Edge
- Camera access for live try-on functionality

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/VUE.AI.git
cd VUE.AI
```

Replace `YOUR-USERNAME` and the repository name with your actual GitHub details.

### 2. Install dependencies

The project includes an Express server. Install its dependency with:

```bash
npm install express
```

If you are using the repository's existing `package.json`, you can also run:

```bash
npm install
```

### 3. Start the server

```bash
node server.js
```

Then open [http://localhost:5000](http://localhost:5000) in your browser.

Alternatively, run the minimal static server:

```bash
node simple-server.js
```

Both server files use port `5000` by default.

> **Note:** Browser camera access generally requires `localhost` or a secure HTTPS connection. Allow camera permission when prompted.

## How to Use

1. Open the app in your browser.
2. Select a clothing item from the catalog.
3. Use the category filters to browse available clothing types.
4. Select **Start Camera** and grant camera permission to use the live camera.
5. Toggle **Mirror** if you prefer a mirrored camera view.
6. Select **Take Photo** to capture the current view.
7. Use the navigation links to explore the Home, Login, Register, and Payment pages.

## Current Limitations

- The included catalog currently has one example T-shirt image.
- The project is a prototype and does not establish that realistic, body-aligned garment rendering is production-ready.
- Login and registration pages are front-end forms; no authentication backend is configured in the provided project.
- The payment page is a front-end UI; no payment gateway or real transaction processing is configured.
- Personalized recommendations and persistent wardrobe management are described in the interface but are not implemented as complete backend features.
- MediaPipe scripts are loaded from a CDN, so an internet connection is required for those scripts.

## Roadmap

- [ ] Add more clothing items and garment categories.
- [ ] Improve garment positioning and scaling using pose landmarks.
- [ ] Add secure backend authentication and user sessions.
- [ ] Connect a database for user profiles and wardrobe items.
- [ ] Integrate a payment provider in test mode before any production use.
- [ ] Add accessibility improvements and test across browsers and screen sizes.
- [ ] Deploy using HTTPS and document the production environment.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes and test them locally.
4. Commit your changes: `git commit -m "Add your feature"`
5. Push the branch and open a Pull Request.

## Security

Do not enter real passwords, payment details, or other sensitive information into this demo. Before deployment, implement server-side validation, secure authentication, appropriate data handling, and a trusted payment provider.

**VUE.AI / StyleSense AI** — exploring a more interactive way to preview fashion online.
