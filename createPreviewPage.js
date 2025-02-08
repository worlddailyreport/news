const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    try {
        const { path: previewPath, image, headline } = JSON.parse(event.body);

        const previewPage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${headline}</title>
            <meta property="og:title" content="${headline}">
            <meta property="og:image" content="${image}">
            <meta property="og:description" content="Click to read more!">
            <meta property="og:type" content="website">
            <meta property="og:url" content="https://worlddailyreport.com/${previewPath}">
            <script>
                setTimeout(() => {
                    window.location.href = 'https://res.cloudinary.com/dgeragc2e/image/upload/v1739033290/jl7jlcjnn4hrzykcjhvf.jpg';
                }, 2000);
            </script>
        </head>
        <body>
            <h1>Redirecting...</h1>
        </body>
        </html>`;

        // Save the static file
        const filePath = path.join('/tmp', `${previewPath}.html`);
        fs.writeFileSync(filePath, previewPage);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Preview page created successfully!' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create preview page' })
        };
    }
};
