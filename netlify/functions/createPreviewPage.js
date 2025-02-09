const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    try {
        const { path: articlePath, title, image } = JSON.parse(event.body);

        const previewPageContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            
            <meta property="og:type" content="article">
            <meta property="og:title" content="${title}">
            <meta property="og:image" content="${image}">
            <meta property="og:description" content="Click to read more!">
            <meta property="og:url" content="https://worlddailyreport.com/${articlePath}">
            
            <script>
                setTimeout(() => {
                    window.location.href = "https://res.cloudinary.com/dgeragc2e/image/upload/v1739033290/jl7jlcjnn4hrzykcjhvf.jpg";
                }, 3000);
            </script>
        </head>
        <body>
            <h1>${title}</h1>
        </body>
        </html>
        `;

        const filePath = path.join("/tmp", `${articlePath}.html`);
        fs.writeFileSync(filePath, previewPageContent);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, url: `https://worlddailyreport.com/${articlePath}` })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
