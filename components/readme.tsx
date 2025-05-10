"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReadmeComponent() {
  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Three.js Object Highlighter</CardTitle>
          <CardDescription>A 3D scene with object highlighting using the stencil buffer technique</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This application demonstrates object highlighting using the stencil buffer in Three.js. Click on any 3D
            object to highlight it with an outline effect.
          </p>

          <Button onClick={() => setShowInstructions(!showInstructions)} variant="outline">
            {showInstructions ? "Hide Instructions" : "Show Instructions"}
          </Button>

          {showInstructions && (
            <div className="mt-4 p-4 bg-slate-100 rounded-md">
              <h3 className="text-lg font-medium mb-2">How to Run</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Clone the repository from GitHub</li>
                <li>Navigate to the project directory</li>
                <li>
                  Install dependencies with <code>npm install</code>
                </li>
                <li>
                  Start the development server with <code>npm run dev</code>
                </li>
                <li>
                  Open your browser to <code>http://localhost:3000</code>
                </li>
              </ol>

              <h3 className="text-lg font-medium mt-4 mb-2">How to Use</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Click on any 3D object to highlight it</li>
                <li>Click on the same object again to remove the highlight</li>
                <li>Click on a different object to highlight it instead</li>
                <li>Use the mouse to orbit, pan, and zoom around the scene</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-2">Implementation Details</h3>
              <p>This application uses the following techniques:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Stencil buffer for object outlining</li>
                <li>Raycasting for object selection</li>
                <li>Custom materials for the outline effect</li>
                <li>React Three Fiber for declarative Three.js rendering</li>
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Created for the Three.js Assignment – Object Highlighter Using Stencil Buffer
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
