const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const { path: fakePath } = data;

        // Netlify _redirects format: fake path redirects to Barry Woods image
        const redirectRule = `/news/${fakePath} https://res.cloudinary.com/dgeragc2e/image/upload/v1739033290/jl7jlcjnn4hrzykcjhvf.jpg 301!
`;

        fs.appendFileSync('/tmp/_redirects', redirectRule);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Redirect rule added successfully!' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create redirect' })
        };
    }
};
