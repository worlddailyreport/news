const fs = require("fs");
const path = require("path");

const dbFilePath = path.join(__dirname, "data.json");

// Load existing stored data
function loadDatabase() {
    if (fs.existsSync(dbFilePath)) {
        return JSON.parse(fs.readFileSync(dbFilePath, "utf8"));
    }
    return {};
}

// Save new data to file
function saveDatabase(data) {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

exports.handler = async (event) => {
    try {
        const { headline, imageUrl } = JSON.parse(event.body);

        if (!headline || !imageUrl) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid input" }),
            };
        }

        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `https://worlddailyreport.com/article/${slug}`;

        // Load current database
        const db = loadDatabase();
        db[slug] = { headline, imageUrl };

        // Save updated database
        saveDatabase(db);

        return {
            statusCode: 200,
            body: JSON.stringify({ shortUrl }),
        };
    } catch (err) {
        retu
