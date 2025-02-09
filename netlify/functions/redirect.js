const fs = require("fs");
const path = require("path");

// ✅ Use Netlify's writable `/tmp/` directory
const dataFilePath = path.join("/tmp", "data.json");

// ✅ Load stored articles from `/tmp/data.json`
function loadArticles() {
    if (fs.existsSync(dataFilePath)) {
        return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    }
    return {};
}

module.exports.handler = async (event) => {
    try {
        const slug = event.path.split("/").pop();

        // ✅ Retrieve articles from `/tmp/data.json`
        let articles = loadArticles();

        if (!articles[slug]) {
            console.error(`❌ No article found for slug: ${slug}`);
            return { statusCode: 404, body: "Error: Article not found." };
        }

        const { headline, imageUrl } = articles[slug];

        console.log(`✅ Showing article: ${headline}`);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
            },
            body: `
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
                    <meta property="og:url" content="https://worlddailyreport.com/article/${slug}">

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
            `,
        };
    } catch (err) {
        console.error("❌ Error retrieving article:", err);
        return { statusCode: 500, body: "Server error." };
    }
};
