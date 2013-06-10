var http = require('http');
var fs = require('fs');


http.createServer(function(request, response) {

    if(['/biere', '/livre'].indexOf(request.url) == -1) {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.statusCode = 404;
        response.write("Page non trouvée");
        for(i = 0; i < 10; i++) {
            response.write("<!-- a padding to disable MSIE and Chrome friendly error page -->");
        }
        response.end();
    } else {
        /*
         * Puisque nous transferons un fichier json, il est important de
         * préciser le type de fichier au navigateur par le
         * mime type (application/json).
         */
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.statusCode = 200;
        fs.readFile("data/"+ request.url.substr(1) +".json", function(err, data) {
            response.write(data.toString());
            response.end();
        });
    }

}).listen(8080, '127.0.0.1');
