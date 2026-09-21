const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Basic response writer
const respond = (req, res, status, content, type) => {
    res.writeHead(status, { 'Content-Type': type });
    res.write(content);
    res.end();
};

// Respond with client.html
const getIndex = (req, res) => {
    respond(req, res, 200, index, 'text/html');
};

// Respond with style.css
const getCSS = (req, res) => {
    respond(req, res, 200, css, 'text/css');
}

// Respond with the correct data and type for the request
const getRoute = (req, res, path) => {
    // Init data as if request succeeds
    let status = 200;
    const resData = {
        message: 'This is a successful response.',
    };

    // Check path and alter data accordingly
    switch (path) {
        // If success, data is already correct
        case '/success':
            break;
        // Checks for required query parameter
        case '/badRequest':
            if (req.query.valid !== 'true') {
                resData.message = 'Missing valid query parameter set to true.';
                resData.id = 'badRequest';
                status = 400;
            }
            break;
        // Checks for required query parameter
        case '/unauthorized':
            if (req.query.loggedIn !== 'yes') {
                resData.message = 'Missing loggedIn query parameter set to yes.';
                resData.id = 'unauthorized';
                status = 401;
            }
            break;
        case '/forbidden':
            resData.message = 'You do not have access to this content.';
            resData.id = 'forbidden';
            status = 403;
            break;
        case '/internal':
            resData.message = 'Internal Server Error. Something went wrong.';
            resData.id = 'internalError';
            status = 500;
            break;
        case '/notImplemented':
            resData.message = 'A get request for this page has not been implemented yet. Check again later for updated content.';
            resData.id = 'notImplemented';
            status = 501;
            break;
        default:
            resData.message = 'The page you are looking for was not found.';
            resData.id = 'notFound';
            status = 404;
            break;
    }
    // Check for and send requested data type
    if (req.acceptedTypes[0] === 'text/xml') {
        let resXML = `<response><message>${resData.message}</message>${resData.id ? `<id>${resData.id}</id>` : ''}</response>`;
        console.log(resXML); // eslint-disable-line no-console
        return respond(req, res, status, resXML, 'text/xml')
    }
    console.log(resData); // eslint-disable-line no-console
    respond(req, res, status, JSON.stringify(resData), 'application/json');
}

module.exports = { getIndex, getCSS, getRoute };