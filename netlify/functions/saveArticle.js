const fs = require("fs");
const path = require("path");
const util = require("util");

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

exports.handler = async (event) => {
    try {
        const { path: articlePath, content } = JSON.parse(event.body);

        const saveDir = path.join(__dirname, "../../public", path.dirname(articlePath));
        const savePath = path.join(__dirname, "../../public", articlePath);

        // Ensure the directory exists before saving the file
        await mkdir(saveDir, { recursive: true });
        await writeFile(savePath, content, "utf8");

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html"
            },
            body: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Article Created</title>
            </head>
            <body>
                <h1>Article successfully created!</h1>
                <p>Your article is available at: <a href="https://worlddailyreport.com/${articlePath}">Click here</a></p>
            </body>
            </html>`
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
