import { readdir, readFile } from "node:fs/promises";
import { join, basename } from "node:path";

export default async function (eleventyConfig) {
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({
    "./src/site.webmanifest": "site.webmanifest",
  });

  // Add resumes collection to create multiple resume pages
  eleventyConfig.addCollection("resumes", async (_collectionApi) => {
    const resumesDir = join("src", "resumes", "_data");
    return await Promise.all(
      (await readdir(resumesDir))
        // skip filenames starting with a period
        .filter((ent) => !ent.startsWith("."))
        .map(async (file) => {
          const name = basename(file, ".json");
          const data = JSON.parse(
            (await readFile(join(resumesDir, file))).toString(),
          );
          return { name, data };
        }),
    );
  });
}

export const config = {
  dir: {
    input: "src",
  },
};
