const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "data.json");

// ✅ Load stored articles
function loadArticles() {
    if (fs.existsSync(dataFilePath)) {
        return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    }
    return {};
}

module.exports.handler = async (event) => {
    try {
        const slug = event.queryStringParameters.slug;
        if (!slug) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing slug" }) };
        }

        let articles = loadArticles();

        if (!articles[slug]) {
            return { statusCode: 404, body: JSON.stringify({ error: "Article not found" }) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(articles[slug]),
        };
    } catch (err) {
        console.error("❌ Error retrieving article:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error." }) };
    }
};
