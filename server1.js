var express = require('express');
var request = require('request');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3005);

app.get('*',function(req,res,next){
  var context = {};
  var bodyObj = {};
  request('http://api.brewerydb.com/v2/brewery/A7Nqfu?key=c55a5013e5a80a7820219511604675a9', function(err, response, body){
    if(!err && response.statusCode < 400){
      bodyObj = JSON.parse(body);
     //console.log(bodyArray);
      context.titleInfo = bodyObj.data.name;
      context.desc = bodyObj.data.description;
      context.url = bodyObj.data.website;
      context.pic = bodyObj.data.images.large;
      res.render('BDBdemo',context);
    } else {
      if(response){
        console.log(response.statusCode);
      }
      next(err);
    }
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});