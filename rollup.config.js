import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import path from "path";
import ts from "rollup-plugin-typescript2";
import pkg from './package.json';
export default {
	input: path.join(__dirname, "/src/index.ts"),
	output:[
		{
			exports:'default',
			file: pkg.main,
			format: 'cjs',
			name: 'kayak',
		  },
		  {
			file: pkg.module,
			format: 'esm',
			name: 'kayak',
			sourcemap: true, 
		  },
		  {
			file: pkg.browser,
			format: 'umd',
			name: 'kayak',
		  },
	],
	plugins: [
		nodeResolve(),
		commonjs({
			include: /node_modules/,
			preserveSymlinks: true,
		}),
		ts(),
	],
};
