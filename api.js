var http = require('http'),
sys = require('sys'),
querystring = require('querystring');

// Set listening port
var port = "3030";

// Create the listening server
http.createServer(function(request, response)
 {
    sys.puts('Request for ' + request.url);

    switch (request.url)
    {
    case '/':
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.write(
        '<h1>QR API Server</h1>'
        );
        response.end();
        break;
    case '/api':
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });

        post_handler(request,
        function(post)
        {
            if(!post.color) post.color = '#000000';

            var QRCode = require(__dirname+'/../qrcode');
            QRCode.QRCodeDraw.color.dark = post.color;
            QRCode.toDataURL(post.data,
            function(err, url) {
                if (err) console.log('error: ' + err);
                response.end(url);
            });

        });

        break;
    };
}).listen(port);

// Grab post data
function post_handler(request, callback)
 {
    var _REQUEST = {};
    var _CONTENT = '';

    if (request.method == 'POST')
    {
        request.addListener('data',
        function(chunk)
        {
            _CONTENT += chunk;
        });

        request.addListener('end',
        function()
        {
            _REQUEST = querystring.parse(_CONTENT);
            callback(_REQUEST);
        });
    };
};