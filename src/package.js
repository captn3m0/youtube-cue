import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("../package.json");

export default data;
