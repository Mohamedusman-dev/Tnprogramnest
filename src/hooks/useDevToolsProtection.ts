import { useEffect } from "react";

export const useDevToolsProtection = () => {
  useEffect(() => {
    // Display a warning message in the console
    console.log(
      "%cStop!",
      "color: red; font-size: 40px; font-weight: bold; text-shadow: 1px 1px 2px black;"
    );
    console.log(
      "%cDeveloper tools are disabled on this website for security reasons.",
      "font-size: 16px; color: #333;"
    );

    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
      }

      // Prevent Ctrl+Shift+I / J / C (Windows/Linux)
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")
      ) {
        e.preventDefault();
      }

      // Prevent Cmd+Option+I / J / C (Mac)
      if (
        e.metaKey &&
        e.altKey &&
        (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")
      ) {
        e.preventDefault();
      }

      // Prevent Ctrl+U / Cmd+U (View Source)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "U" || e.key === "u")
      ) {
        e.preventDefault();
      }
      
      // Prevent Ctrl+S / Cmd+S (Save Page)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "S" || e.key === "s")
      ) {
        e.preventDefault();
      }
    };

    // Attach event listeners to the document
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup listeners on unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
