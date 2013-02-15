http        = require 'http'
util        = require 'util'
querystring = require 'querystring'
QRCode      = require 'qrcode'
port        = 8888

server = http.createServer (request, response) -> 
  util.puts 'Request for ' + request.url

  switch request.url
    when '/'
      response.writeHead 200, {'Content-Type': 'text/html'}
      response.write '<h1>QR API Server</h1>'
      do response.end
    when '/api'
      response.writeHead 200, {'Content-Type': 'application/json'}
      post_handler request, (post) ->

        QRCode.toDataURL post.data, (err, url) ->
          console.log 'error: ' + err if err
          response.end url

server.listen port

post_handler = (request, callback) ->
  _REQUEST = {};
  _CONTENT = '';

  if request.method == 'POST'
    request.addListener 'data', (chunk) ->
      _CONTENT += chunk

    request.addListener 'end', ->
      _REQUEST = querystring.parse _CONTENT
      callback _REQUEST
