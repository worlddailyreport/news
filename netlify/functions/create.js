const fs = require("fs");
const path = require("path");

const dbFilePath = path.join(__dirname, "data.json");

// Load stored links from file
function loadDatabase() {
    if (fs.existsSync(dbFilePath)) {
        try {
            return JSON.parse(fs.readFileSync(dbFilePath, "utf8"));
        } catch (error) {
            console.error("❌ Error reading database file:", error);
            return {};
        }
    }
    return {};
}

// Save updated data to file
function saveDatabase(data) {
    try {
        fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("❌ Error writing to database file:", error);
    }
}

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        const { headline, imageUrl } = JSON.parse(event.body);

        if (!headline || !imageUrl) {
            console.error("❌ Missing required fields.");
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid input" }) };
        }

        // Create a unique slug
        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `https://worlddailyreport.com/article/${slug}`;

        // Load current database
        const db = loadDatabase();
        db[slug] = { headline, imageUrl };

        // Save updated database
        saveDatabase(db);

        console.log(`✅ New fake article created: ${shortUrl}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ shortUrl }),
        };
    } catch (err) {
        console.error("❌ Server error:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
    }
};
