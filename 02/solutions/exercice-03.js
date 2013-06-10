var http = require('http');

http.createServer(function(request, response) {
    response.statusCode = 200;
    /*
     * Pour s'assurer que le HTML soit affiché par un navigateur, il faut
     * préciser le Content-Type.
     * Tous les headers doivent être précisé avant d'envoyer le contenu avec
     * response.write()
     */
    response.setHeader("Content-Type", "text/html");

    /*
     * Partie 1
     */
    response.write("Hello World!");

    /*
     * Partie 2
     */

    response.write("L'url actuel est : <span style='font-weight:bold'>"+ request.url +"</span>");
    response.end();

}).listen(8080, '127.0.0.1');
