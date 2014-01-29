#!/usr/bin/nodemon

# Setup.
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
    url = req.params[0]
    query = req.params[1] || ''
    res.redirect(url + '/' + query)

app.use (req, res)->
    res.send('Page not found.', 404)
