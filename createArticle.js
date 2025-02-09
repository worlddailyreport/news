const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    try {
        const { path: articlePath, title, image } = JSON.parse(event.body);

        // Ensure correct directory structure
        const saveDir = path.join(__dirname, "../../public/article/");
        const savePath = path.join(saveDir, `${articlePath}.html`);

        // Create directory if missing
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
        }

        // Generate the article HTML page that redirects to Barry Woods
        const articleContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>

            <!-- Open Graph Meta Tags (For iMessage Preview) -->
            <meta property="og:type" content="article">
            <meta property="og:title" content="${title}">
            <meta property="og:image" content="${image}">
            <meta property="og:description" content="Breaking news: ${title}">
            <meta property="og:url" content="https://worlddailyreport.com/article/${articlePath}.html">

            <script>
                window.location.replace("https://res.cloudinary.com/dgeragc2e/image/upload/v1739033290/jl7jlcjnn4hrzykcjhvf.jpg");
            </script>
        </head>
        <body>
            <h1>${title}</h1>
            <p>If not redirected, <a href="https://res.cloudinary.com/dgeragc2e/image/upload/v1739033290/jl7jlcjnn4hrzykcjhvf.jpg">click here</a>.</p>
        </body>
        </html>`;

        fs.writeFileSync(savePath, articleContent, "utf8");

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: true, url: `https://worlddailyreport.com/article/${articlePath}.html` })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error.message })
        };
    }
};
