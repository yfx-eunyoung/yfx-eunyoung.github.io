// Resume button on the homepage: links to /resume.pdf only when src/resume.pdf exists.
import { existsSync } from "node:fs";

export default function () {
  return existsSync("src/resume.pdf") ? { url: "/resume.pdf", fileName: "Eunyoung-Kim-Resume.pdf" } : null;
}
