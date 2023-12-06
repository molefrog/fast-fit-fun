import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import externalGlobals from "rollup-plugin-external-globals";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  let libraryOptions = {};

  if (command === "build") {
    libraryOptions = {
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      build: {
        lib: {
          entry: "./src/library.tsx",
          formats: ["es"],
        },

        rollupOptions: {
          plugins: [
            externalGlobals({
              react: "$__externals.React",
              "react/jsx-runtime": "$__externals.JSXRuntime",
              "react-dom": "$__externals.ReactDOM",
            }),
          ],
        },
      },
    };
  }

  return {
    ...libraryOptions,
    plugins: [react({ tsDecorators: true })],
  };
});
