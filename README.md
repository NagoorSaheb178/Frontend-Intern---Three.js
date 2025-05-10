# Three.js Object Highlighter Using Stencil Buffer

This project demonstrates a 3D scene built with Three.js where users can click on objects to highlight them with an outline effect using the stencil buffer technique.

## Features

- Interactive 3D scene with 5 different geometric objects
- Object selection via mouse clicking (raycasting)
- Stencil buffer-based outline highlighting for selected objects
- Only one object highlighted at a time
- Orbit controls for scene navigation
- Proper lighting and shadows

## Technical Implementation

The application uses:
- **Three.js** for 3D rendering
- **React Three Fiber** as a React renderer for Three.js
- **Stencil Buffer** for creating the outline effect
- **Raycasting** for object selection
- **Custom materials** for the outline effect

## How the Stencil Buffer Works

The stencil buffer technique used in this project works as follows:

1. First, all objects are rendered normally to the color and depth buffers
2. When an object is selected, we:
   - Render the object to the stencil buffer (marking its pixels)
   - Render a slightly larger version of the same object with a different material
   - Use stencil operations to only render the outline where the stencil test passes

This creates a clean outline effect that works with any geometry.

## Running the Project

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/your-username/three-js-object-highlighter.git
   cd three-js-object-highlighter
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   # or
   yarn install
   \`\`\`

3. Start the development server:
   \`\`\`
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open your browser and navigate to `http://localhost:3000`

## Usage

- **Click** on any object to highlight it
- **Click** on the same object again to remove the highlight
- **Click** on a different object to highlight it instead
- Use the mouse to **orbit**, **pan**, and **zoom** around the scene:
  - Left-click + drag to rotate
  - Right-click + drag to pan
  - Scroll to zoom

## Project Structure

- `components/object-highlighter.tsx` - Main component containing the Three.js scene
- `components/readme.tsx` - Interactive README component
- `app/page.tsx` - Main page that renders the 3D scene
- `app/readme/page.tsx` - Page that displays the README

## What I Learned

- Advanced Three.js rendering techniques
- Working with the stencil buffer
- Implementing custom materials
- Object selection via raycasting
- Creating reusable 3D components with React Three Fiber
