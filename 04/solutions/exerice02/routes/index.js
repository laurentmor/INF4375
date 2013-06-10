
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { cours: res.app.get('cours') });
};

exports.cours = function(req, res){
    cours = res.app.get('cours');
    if(typeof(cours[req.params.sigle]) == "undefined") {
        res.send(404, 'Le cours "' + req.params.sigle + '" n\'existe pas.');
    }

    info_cours = cours[req.params.sigle];
    console.log(info_cours.nom);
    res.render('cours', {
        'sigle': req.params.sigle,
        'nom': info_cours.nom,
        'url': info_cours.url,
        'prerequis': info_cours.prerequis,
        'offert': info_cours.offert
    });
};
