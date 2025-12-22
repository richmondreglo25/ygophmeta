const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Copy public assets to output
  eleventyConfig.addPassthroughCopy("public");

  // Add a collection for events
  eleventyConfig.addCollection("events", function () {
    const eventsDir = path.join(__dirname, "public/data/events");
    const files = fs
      .readdirSync(eventsDir)
      .filter((file) => file.endsWith(".json"));

    let allEvents = [];

    files.forEach((file) => {
      const filePath = path.join(eventsDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const events = JSON.parse(content);
      allEvents = allEvents.concat(events);
    });

    return allEvents;
  });

  // Add date filter
  eleventyConfig.addFilter("formatDate", function (dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  // Add ordinal filter for positions (1st, 2nd, 3rd, etc.)
  eleventyConfig.addFilter("ordinal", function (number) {
    const j = number % 10;
    const k = number % 100;
    if (j == 1 && k != 11) {
      return number + "st";
    }
    if (j == 2 && k != 12) {
      return number + "nd";
    }
    if (j == 3 && k != 13) {
      return number + "rd";
    }
    return number + "th";
  });

  return {
    dir: {
      input: "_site",
      output: "_output",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
