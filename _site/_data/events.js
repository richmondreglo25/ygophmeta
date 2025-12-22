/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

module.exports = function () {
  const eventsDir = path.join(__dirname, "../../public/data/events");
  const files = fs
    .readdirSync(eventsDir)
    .filter((file) => file.endsWith(".json"));

  let allEvents = [];
  const seenIds = new Set();

  files.forEach((file) => {
    const filePath = path.join(eventsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const events = JSON.parse(content);

    // Only add events we haven't seen before (deduplicate by ID)
    events.forEach((event) => {
      if (!seenIds.has(event.id)) {
        seenIds.add(event.id);
        allEvents.push(event);
      }
    });
  });

  return allEvents;
};
