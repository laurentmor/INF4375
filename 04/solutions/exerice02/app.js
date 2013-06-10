
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/:sigle', routes.cours);

fs.readFile('data/cours_automne_2013.json', function(err, data) {
    if(err) {
        throw "Impossible de lirele fichier : " + err;
    }

    app.set('cours', JSON.parse(data));

    /*
     * Lorsque le fichier est lu, on peut lancer le serveur.
     * Il aurait été possible de faire une lecture synchrone avec
     * fs.readFileSync puisque la lecture ne se fait qu'une seule fois au début.
     */
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
});

