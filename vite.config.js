import { createVuePlugin } from "vite-plugin-vue2";
import * as path from "path";

export default {
  plugins: [createVuePlugin()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }]
  }
};
