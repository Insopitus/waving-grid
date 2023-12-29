import { defineConfig } from "vite";
// import { threeMinifier } from "@yushijinhun/three-minifier-rollup";
// import visualizer from 'rollup-plugin-visualizer'
export default defineConfig({
	base:'./'
	plugins: [
		// { ...threeMinifier(), enforce: "pre" }, // <=== Add plugin here
		// visualizer()
	]
});
