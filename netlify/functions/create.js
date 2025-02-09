const fs = require("fs");
const path = require("path");

const articlesDir = path.join(__dirname, "../../public/articles"); // ✅ Store pages in /public/articles

// ✅ Ensure the articles directory exists
if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
}

module.exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const { headline, imageUrl } = JSON.parse(event.body);

        if (!headline || !imageUrl) {
            console.error("❌ Missing required fields.");
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid input. Headline and Image URL are required." }) };
        }

        // ✅ Generate a URL-friendly slug
        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `/articles/${slug}.html`;

        // ✅ Create static HTML page
        const articleHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${headline} - World Daily Report</title>

                <!-- ✅ Open Graph Meta Tags for Social Media Previews -->
                <meta property="og:title" content="${headline}">
                <meta property="og:image" content="${imageUrl}">
                <meta property="og:description" content="Breaking: ${headline}">
                <meta property="og:type" content="website">
                <meta property="og:url" content="https://worlddailyreport.com${shortUrl}">

                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:title" content="${headline}">
                <meta name="twitter:description" content="Click to read more!">
                <meta name="twitter:image" content="${imageUrl}">

                <!-- ✅ Redirect after 3 seconds to Barry Woods -->
                <meta http-equiv="refresh" content="3;url=https://i.imghippo.com/files/JfSn7929Qs.jpg">

                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { font-size: 2em; }
                    img { max-width: 80%; margin-top: 20px; }
                    p { font-size: 1.2em; color: gray; }
                </style>
            </head>
            <body>
                <h1>${headline}</h1>
                <img src="${imageUrl}">
                <p>Loading article...</p>
            </body>
            </html>
        `;

        // ✅ Save HTML file in `/public/articles/`
        fs.writeFileSync(path.join(articlesDir, `${slug}.html`), articleHtml);

        console.log(`✅ Article created: ${headline} (https://worlddailyreport.com${shortUrl})`);

        return {
            statusCode: 200,
            body: JSON.stringify({ shortUrl: `https://worlddailyreport.com${shortUrl}` }),
        };
    } catch (err) {
        console.error("❌ Error generating article page:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error while generating article page." }) };
    }
};
