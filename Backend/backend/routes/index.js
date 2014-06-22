var express = require('express');
var mongodb = require('mongodb');
var createSchema = require('json-gate').createSchema;

var mongoDbConnection = require('./connection.js');

var BSON = mongodb.BSONPure;
var router = express.Router();

var schemaDossier = createSchema({
    "type": "object",
    "properties": {
        "nom": {
            "type": "string",
            "required": false
        },
        "prenom": {
            "type": "string",
            "required": false
        },
        "codePermanent": {
            "type": "string",
            "required": false
        }, "sexe": {
            "type": "integer",
            "required": false
        },
        "dateNaissance": {
            "type": "string",
            "required": false
        },
        "listeCours": {
            "type": []
        }
    },
    additionalProperties: false
});

//Service - 1 Envoie au client le dossier complet de l'étudiant, en format JSON 
router.get('/dossiers/:cp', function(req, res) {
    var leCode = req.params.cp;
    //TODO valider le cp
    mongoDbConnection(function(databaseConnection) {
        var criteres = {
            codePermanent: leCode
        };
        databaseConnection.collection('dossiers').find(criteres).toArray(function(err, items) {
            var leDossier = items[0];
            res.json(leDossier);
        });
    });
});
//service - 2 ajoute un dossier étudiant
//Reçoit du client un dossier complet d'étudiant, en format JSON, 
//et crée le dossier
router.post('/dossiers', function(req, res) {
    var dossier = req.body;
    try {

        schemaDossier.validate(dossier);
        mongoDbConnection(function(databaseConnection) {
            databaseConnection.collection('dossiers').insert(dossier,
                    function(err, result) {
                        if (err) {
                            res.json(500, {error: err});
                        }
                        else {
                            res.json(200, {msg: 'OK'});
                        }
                    });
        });
    }
    catch (e) {
        res.json(500, {error: e});
    }
});
//Service - 3 Reçoit du client l'ensemble des modifications à apporter au dossier
// en format JSON,et les applique au dossier

router.put('/dossiers/:cp', function(req, res) {
    var codePermanent = req.params.cp;
    var modificationsDossier = req.body;

    try {
        schemaDossier.validate(modificationsDossier);

        mongoDbConnection(function(databaseConnection) {

            databaseConnection.collection('editeurs').update(
                    {'codePermanent': codePermanent},
            {$set: modificationsDossier},
            function(err, result) {

                if (err) {
                    res.json(500, {error: err});
                } else {
                    res.json(200, {msg: 'OK', nombreDocumentsAffectesParUpdate: result});
                }
            });
        });

    } catch (error) {
        res.json(500, {error: error.toString()});
    }
});
//Service - 4 Supprime le dossier de l'étudiant.
// Il est impossible de supprimer un dossier si 
// l'étudiant a déjà complété un cours avec succès.
router.delete('/dossiers/:cp', function(req, res) {
    var leCode = req.params.cp;
    //TODO valider le cp
    mongoDbConnection(function(databaseConnection) {
        var leDossier;
        var criteres = {
            codePermanent: leCode
        };
        databaseConnection.collection('dossiers').find(criteres).toArray(function(err, items) {
            leDossier = items[0];
            if (etudiantAvecCoursReussi(leDossier)) {
                res.json(500, {error: "Impossible de suprimmer le dossier." +
                            "l'étudiant a déjà réussi un cours"});

            }
            else {
                databaseConnection.collection('dossiers').remove(leDossier, function(err, res) {
                    if (err) {
                        res.json(500, {error: err});
                    } else
                        res.json(200, {msg: "Suppression correcte"});
                });
            }

        });

    });

});

// service - 5 Envoie au client le groupeCours  en format JSON 
router.get('/groupes/:oid', function(req, res) {
    var id = req.params.oid;

    mongoDbConnection(function(databaseConnection) {
        if (mongodb.ObjectID.isValid(id)) {
            var criteres = {
                _id: mongodb.ObjectID(id)
            };

            console.log("OK");
            databaseConnection.collection('groupesCours').find(criteres).toArray(function(err, items) {
                var leGroupe = items[0];
                res.json(leGroupe);
            });
        }
    });
});
//Service - 8 Supprime le groupe-cours. 
//Il est impossible de supprimer un groupe-cours où des étudiants y sont inscrits
router.delete('/groiupes/:oid', function(req, res) {
    var id = req.params.id;
    mongoDbConnection(function(databaseConnection) {
        if (mongodb.ObjectID.isValid(id)) {
            var criteres = {
                _id: mongodb.ObjectID(id)
            };
            databaseConnection.collection('groupesCours').find(criteres).toArray(function(err, items) {
                if (err) {
                    res.json(500, {error: err});
                }
                else {
                    var leGroupe = items[0];
                    if (groupeAvecEtudiants(leGroupe)) {
                        res.json(500, {error: "Impossible de suprimmer le groupe-cours." +
                                    "des étudiants y sont inscrits"});
                    }
                    else {
                        databaseConnection.collection('groupesCours').remove(leGroupe, function(err, res) {
                            if (err) {
                                res.json(500, {error: err});
                            } else
                                res.json(200, {msg: "Suppression correcte"});
                        });
                    }
                }
            }
            );
        }



    });

});

function etudiantAvecCoursReussi(etd) {
    return etd.listeCoursReussis.length > 0;
}

function groupeAvecEtudiants(grp) {
    return grp.listeEtudiants.length > 0;
}



module.exports = router;
