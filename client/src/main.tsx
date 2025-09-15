import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add comprehensive error handling
console.log("Starting application...");

window.addEventListener('error', (e) => {
  console.error('Global error caught:', e.error);
  console.error('Error message:', e.message);
  console.error('Error filename:', e.filename);
  console.error('Error lineno:', e.lineno);
  console.error('Error colno:', e.colno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Add error boundary to catch any rendering errors
try {
  console.log("Attempting to find root element...");
  const rootElement = document.getElementById("root");
  console.log("Root element found:", rootElement);
  
  if (rootElement) {
    console.log("Rendering App component...");
    createRoot(rootElement).render(<App />);
    console.log("App component rendered successfully");
  } else {
    console.error("Failed to find the root element");
    // Add a visible error message to the page
    document.body.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fee; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif;">
        <div style="text-align: center; padding: 20px; border: 1px solid #fcc; border-radius: 8px; background: #fff;">
          <h1 style="color: #c33;">Error: Root Element Not Found</h1>
          <p>The application could not find the root element to render into.</p>
        </div>
      </div>
    `;
  }
} catch (error) {
  console.error("Error rendering the app:", error);
  // Add a visible error message to the page
  document.body.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fee; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif;">
      <div style="text-align: center; padding: 20px; border: 1px solid #fcc; border-radius: 8px; background: #fff;">
        <h1 style="color: #c33;">Error Rendering Application</h1>
        <p>An error occurred while rendering the application:</p>
        <pre style="text-align: left; background: #fdd; padding: 10px; border-radius: 4px; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
      </div>
    </div>
  `;
}