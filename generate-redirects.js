import fs from "fs";
import path from "path";

const BE = process.env.VITE_BE_DOMAIN_NAME;

if (!BE) {
  console.error("VITE_BE_DOMAIN_NAME is not set — skipping _redirects generation");
  process.exit(0);
}

const content = `/api/*  ${BE}/api/:splat  200\n/*      /index.html          200\n`;

fs.writeFileSync(path.resolve("public/_redirects"), content);
console.log("_redirects generated:", content.trim());
