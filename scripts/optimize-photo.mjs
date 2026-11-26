// One-off: converts public/profile_pic.jpg into AVIF/WebP at 2x of its display size.
import sharp from "sharp";

const src = "public/profile_pic.jpg";
const base = () => sharp(src).resize({ width: 400, height: 495, fit: "cover", position: "top" });

await base().avif({ quality: 52 }).toFile("public/profile.avif");
await base().webp({ quality: 74 }).toFile("public/profile.webp");
await base().jpeg({ quality: 78, mozjpeg: true }).toFile("public/profile_pic.min.jpg");
console.log("photo optimised");
