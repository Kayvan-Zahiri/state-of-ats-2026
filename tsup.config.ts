import { defineConfig } from "tsup";

export default defineConfig({
  // Preserve module-relative dataset loading in both ESM and CommonJS builds.
  shims: true,
});
