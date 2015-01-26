#!/usr/bin/nodemon

# Setup.
url = require('url')
express = require('express')
app = express()
port = process.env.PORT || 8000
app.listen(port)
app.use(express.static(__dirname + '/public'))
process.stdout.write "Server live on port #{port}...\n"

# # # # #
# Routes #
# # # # # #

# ACTA JavaScript.
app.get '/acta/js', (req, res)->
    res.redirect('acta/popup.js')

# Add trailing slashes.
app.get /^\/([\/\w-]*[\w]+)(\?.*)?$/, (req, res)->
    path = req.params[0]
    query = url.parse(req.url).query

    if query
        query = '?' + query
    else
        query = ''

    res.redirect(path + '/' + query)

app.use (req, res)->
    res.redirect('/404')
