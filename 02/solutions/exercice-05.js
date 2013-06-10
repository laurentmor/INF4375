var http = require('http');
var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;

var route = {
    '/biere': function(request, response) {
        fs.readFile('data/biere.xml', function(err, data) {
            var doc = new DOMParser().parseFromString(data.toString());
            var compagnies_json = [];
            var compagnies = doc.getElementsByTagName('compagnie');
            for (var i = 0; i < compagnies.length; i++) {
                compagnie = compagnies[i];
                var bieres_json = [];
                var bieres = compagnie.getElementsByTagName('biere');
                for(var j = 0; j < bieres.length; j++) {
                    bieres_json.push(bieres[j].textContent);
                }
                compagnies_json.push({
                    'nom': compagnie.getElementsByTagName('nom')[0].textContent,
                    'logo': compagnie.getElementsByTagName('logo')[0].textContent,
                    'bieres': bieres_json,
                });
            }
            response.write(JSON.stringify(compagnies_json));
            response.end();
        });
    },
    '/livre': function(request, response) {
        fs.readFile('data/livre.xml', function(err, data) {
            var doc = new DOMParser().parseFromString(data.toString());
            var livres_json = [];
            var livres = doc.getElementsByTagName('livre');
            for (var i = 0; i < livres.length; i++) {
                livre = livres[i];
                var auteurs = livre.getElementsByTagName('auteur');
                var auteurs_json;
                if(auteurs.length == 1) {
                    auteurs_json = auteurs[0].textContent;
                } else {
                    auteurs_json = [];
                    for(var j = 0; j < auteurs.length; j++) {
                        auteurs_json.push(auteurs[j].textContent);
                    }
                }
                livres_json.push({
                    'auteur': auteurs_json,
                    'nom': livre.getElementsByTagName('nom')[0].textContent,
                    'prix': livre.getElementsByTagName('prix')[0].textContent,
                });
            }
            response.write(JSON.stringify(livres_json));
            response.end();
        });
 
    }
};

http.createServer(function(request, response) {
    /*
     * Pour s'assurer que le HTML soit affiché par un navigateur, il faut
     * préciser le Content-Type.
     * Tous les headers doivent être précisé avant d'envoyer le contenu avec
     * response.write()
     */

    if(request.url in route) {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        var routed_method = route[request.url];
        routed_method(request, response);
    } else {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html");
        response.write("Page non trouvée");
        for(i = 0; i < 10; i++) {
            response.write("<!-- a padding to disable MSIE and Chrome friendly error page -->");
        }
        response.end();
    }

}).listen(8080, '127.0.0.1');
