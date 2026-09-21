const http = require('http');
const responses = require('./responses.js');


const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Routes and their respective handlers
const urlStruct = {
    '/': responses.getIndex,
    '/style.css': responses.getCSS,
    default: responses.getRoute
};

// Gets information about the request and chooses the correct handler
const onRequest = (req, res) => {
    const parsedURL = new URL(req.url, `${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}`);

    req.acceptedTypes = req.headers.accept ? req.headers.accept.split(',') : [];
    req.query = Object.fromEntries(parsedURL.searchParams);

    const handler = urlStruct[parsedURL.pathname];

    if (handler) handler(req, res);
    else urlStruct.default(req, res, parsedURL.pathname);
};


http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`); // eslint-disable-line no-console
});
