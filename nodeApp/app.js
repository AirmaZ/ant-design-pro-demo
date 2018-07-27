let express = require('express');
let app = express();
let path = require('path');




app.use('/public',express.static(__dirname + "/../dist"));

app.get('/api*', function (req, res) {
  res.json({success:true});
});

// BrowserHistory code
app.get('/welcome*', function (request, response){
  response.sendFile(path.resolve(__dirname+'/../', 'dist', 'index.html'));
});

let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
