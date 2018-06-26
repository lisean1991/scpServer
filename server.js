
var express = require('express'),
    routes = require('./app/routes/index.js'),
    babelCore = require('babel-core'),
    bodyParser = require('body-parser');
    require("body-parser-xml")(bodyParser);
var app = express();
var cf_app = require( './app/vcap_application');
var cf_svc = require( './app/vcap_services');
var ejs = require('ejs');

app.set( 'views', process.cwd() + '/views');
// app.set( 'view engine', 'jade')
app.use( express.static( process.cwd() + '/public'));
app.use(bodyParser.xml({
  limit: "1MB",   // Reject payload bigger than 1 MB
  xmlParseOptions: {
  normalize: true,     // Trim whitespace inside text nodes
  // normalizeTags: true, // Transform tags to lowercase
  explicitArray: false // Only put nodes in array if >1
}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/views", express.static( process.cwd() + '/views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.get( '/', function ( req, res) {
  console.log(req.host);
  res.header("Content-Type", "text/html;charset=utf-8");
  res.render('dist/index',{})

});
app.all('/api/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
routes(app);

app.listen(process.env.PORT || 4000);
