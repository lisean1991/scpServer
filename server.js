var express = require( 'express')
var app = express()
var cf_app = require( './app/vcap_application')
var cf_svc = require( './app/vcap_services')
var ejs = require('ejs')

app.set( 'views', process.cwd() + '/views')
// app.set( 'view engine', 'jade')
app.use( express.static( process.cwd() + '/public'))
app.use("/views", express.static( process.cwd() + '/views'))
app.engine('html', ejs.__express)
app.set('view engine', 'html')

app.get( '/', function ( req, res) {
  // res.render( 'pages/index', {
  //   app_environment:    app.settings.env,
  //   application_name:   cf_app.get_app_name(),
  //   app_uris:           cf_app.get_app_uris(),
  //   app_space_name:     cf_app.get_app_space(),
  //   app_index:          cf_app.get_app_index(),
  //   app_mem_limits:     cf_app.get_app_mem_limits(),
  //   app_disk_limits:    cf_app.get_app_disk_limits(),
  //   services_label:     cf_svc.get_services_label(),
  //   services_name:      cf_svc.get_services_name(),
  //   services_plan:      cf_svc.get_services_plan()
  // })
  // res.sendfile( __dirname + '/public/client/webapp/index.html')
  console.log(__dirname);
  res.render('dist/index',{})

})

app.listen(process.env.PORT || 4000)
