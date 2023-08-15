import { resolve } from "path";
import { defineConfig } from "vite";
import { copyFileSync } from "fs";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "Turbopages",
      fileName: "index",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
  plugins: [copyForTesting()],
});

function copyForTesting() {
  return {
    closeBundle: () => {
      const build = "./dist/index.js";
      const example = "./demo/turbopages.js";
      copyFileSync(build, example);
      console.log(`copied bundle to example`);
    },
  };
}
