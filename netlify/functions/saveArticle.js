const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    try {
        const { path: articlePath, title, image } = JSON.parse(event.body);

        const saveDir = path.join(__dirname, "../../public", path.dirname(articlePath));
        const savePath = path.join(__dirname, "../../public", articlePath);

        // Ensure directory exists
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
        }

        // Generate the correct Open Graph metadata
        const previewPageContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>

            <!-- Open Graph Meta Tags for iMessage Preview -->
            <meta property="og:type" content="article">
            <meta property="og:title" content="${title}">
            <meta property="og:image" content="${image}">
            <meta property="og:description" content="Click to read more!">
            <meta property="og:url" content="https://worlddailyreport.com/${articlePath}">

            <script>
                setTimeout(() => {
                    window.location.href = "https://res.cloudinary.com/dgeragc2e/image/upload/v1739033290/jl7jlcjnn4hrzykcjhvf.jpg";
                }, 5000);
            </script>
        </head>
        <body>
            <h1>${title}</h1>
            <p>Redirecting...</p>
        </body>
        </html>`;

        // Save the file
        fs.writeFileSync(savePath, previewPageContent, "utf8");

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: true, url: `https://worlddailyreport.com/${articlePath}` })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error.message })
        };
    }
};
