
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.date = function(req, res) {
    var date_actuelle = new Date();
    //Date.getDay() retourne un chiffre de 0 à 6 (0 = Dimanche, 6 = Dimanche)
    res.json({
        'jour': date_actuelle.getDay() + 1,
        'mois': date_actuelle.getMonth(),
        'annee': date_actuelle.getFullYear(),
    });
};

exports.heure = function(req, res) {
    var date_actuelle = new Date();
    res.json({
        'heure': date_actuelle.getHours(),
        'minute': date_actuelle.getMinutes(),
        'seconde': date_actuelle.getSeconds(),
    });
};
