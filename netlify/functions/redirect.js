const fs = require("fs");
const path = require("path");

const dbFilePath = path.join(__dirname, "data.json");

// Load stored headlines & images
function loadDatabase() {
    if (fs.existsSync(dbFilePath)) {
        return JSON.parse(fs.readFileSync(dbFilePath, "utf8"));
    }
    return {};
}

exports.handler = async (event) => {
    const slug = event.path.split("/").pop();
    const db = loadDatabase();

    if (!db[slug]) {
        return { statusCode: 404, body: "Article not found" };
    }

    const { headline, imageUrl } = db[slug];  // ✅ Retrieve correct user-inputted image

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

                <!-- ✅ OpenGraph Meta Tags for iMessage & Social Media Previews -->
                <meta property="og:title" content="${headline}">
                <meta property="og:image" content="${imageUrl}">  <!-- ✅ Shows the user's image -->
                <meta property="og:description" content="Breaking: ${headline}">
                <meta property="og:type" content="website">
                <meta property="og:url" content="${event.rawUrl}">

                <!-- ✅ Twitter Card Meta Tags for X/Twitter Previews -->
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:title" content="${headline}">
                <meta name="twitter:description" content="Click to read more!">
                <meta name="twitter:image" content="${imageUrl}">  <!-- ✅ Shows the correct image -->

                <!-- ✅ Redirect After 3 Seconds -->
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
                <img src="${imageUrl}">  <!-- ✅ Displays the correct image -->
                <p>Loading article...</p>
            </body>
            </html>
        `,
    };
};
