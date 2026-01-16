/**
 * Eleventy data file for posts - handles dynamic permalink generation
 *
 * This file uses Eleventy's eleventyComputed feature to dynamically generate permalinks
 * for blog posts based on their frontmatter data. The permalink function runs at build time
 * and determines the final URL structure for each post.
 *
 * @see https://www.11ty.dev/docs/data-computed/ - eleventyComputed documentation
 * @see https://www.11ty.dev/docs/permalinks/ - permalink documentation
 *
 * Conditional logic:
 * 1. Future posts (date > today) are not published (returns false)
 * 2. Explicit permalink in frontmatter takes precedence
 * 3. Auto-generate from title using slugify filter: /blog/{slug}/
 * 4. Posts without title or permalink are not published
 */

import slugify from "slugify";

// Global slug registry to track used slugs during build
const usedSlugs = new Set();

export default {
  eleventyComputed: {
    // Generate permalink URLs for blog posts
    permalink: (data) => {
      // If the post date is in the future, do not publish
      if (data.date && new Date(data.date) > new Date()) {
        return false;
      }

      // If the post has an explicit permalink, use it
      if (data.permalink) return data.permalink;


      // If no permalink is provided, generate permalink from title using slugify
      if (data.title) {
        let baseSlug = slugify(data.title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 2;
        // Ensure uniqueness by appending a number if needed
        while (usedSlugs.has(slug)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        usedSlugs.add(slug);
        return `/blog/${slug}/`;
      }

      // If neither permalink nor title is provided, this post is not published
      return false;
    },
  },
};
