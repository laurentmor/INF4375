/* 
 * The MIT License
 *
 * Copyright 2014 Laurent Morissette.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * 
 * Module des services REST 
 */
var express = require('express');
var mongodb = require('mongodb');


var mongoDbConnection = require('./connection.js');


var router = express.Router();
var schemas = require('./schema.js');


/**
 * Service - 1 Envoie au client le dossier complet de l'étudiant, en format JSON 
 */
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
/**
 * service - 2 ajoute un dossier étudiant
 * Reçoit du client un dossier complet d'étudiant, en format JSON,
 * et crée le dossier*/
router.post('/dossiers', function(req, res) {
    var dossier = req.body;
    try {
        var resultatValidation = schemas.validerDossier(dossier);

        if (!resultatValidation.valid) {
            res.json(500, {error: resultatValidation.format()});
        } else {
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
    }
    catch (e) {
        res.json(500, {error: e});
    }
});
/**
 * Service - 3 Reçoit du client l'ensemble des modifications à apporter au dossier
 *  en format JSON,et les applique au dossier
 */

router.put('/dossiers/:cp', function(req, res) {
    var codePermanent = req.params.cp;
    var modificationsDossier = req.body;

    try {
        var resultatValidation = schemas.validerDossier(modificationsDossier);

        if (!resultatValidation.valid) {
            res.json(500, {error: resultatValidation.format()});
        }

        else {
            mongoDbConnection(function(databaseConnection) {

                databaseConnection.collection('dossiers').update(
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
        }

    } catch (error) {
        res.json(500, {error: error.toString()});
    }
});
/**Service - 4 Supprime le dossier de l'étudiant.
 * Il est impossible de supprimer un dossier si 
 * l'étudiant a déjà complété un cours avec succès.*/
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

/** service - 5 Envoie au client le groupeCours  en format JSON*/
router.get('/groupes/:oid', function(req, res) {
    var id = req.params.oid;

    mongoDbConnection(function(databaseConnection) {
        if (mongodb.ObjectID.isValid(id)) {
            var criteres = {
                _id: mongodb.ObjectID(id)
            };


            databaseConnection.collection('groupesCours').find(criteres).toArray(function(err, items) {
                var leGroupe = items[0];
                res.json(leGroupe);
            });
        }
    });
});

/**service - 6 ajoute un groupe-cours
 *Reçoit du client un groupe, en format JSON, 
 et crée le dossier*/
router.post('/groupes', function(req, res) {
    var groupe = req.body;
    try {
        var resultatValidation = schemas.validerGroupe(groupe);

        if (!resultatValidation.valid) {
            res.json(500, {error: resultatValidation.format()});
        } else {
            mongoDbConnection(function(databaseConnection) {
                databaseConnection.collection('groupesCours').insert(groupe,
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
    }
    catch (e) {
        res.json(500, {error: e});
    }
});
/**
 * Service - 7 Mettre à jour un Groupe-cours
 */
router.put('/groupes/:oid', function(req, res) {
    var id = req.params.oid;
    var modificationsGroupe = req.body;
    try {
        var resultatValidation = schemas.validerGroupe(modificationsGroupe);

        if (!resultatValidation.valid) {
            res.json(500, {error: resultatValidation.format()});
        }
        else {
            mongoDbConnection(function(databaseConnection) {
                if (mongodb.ObjectID.isValid(id)) {
                    var criteres = {
                        _id: mongodb.ObjectID(id)
                    };
                    databaseConnection.collection('groupesCours').find(criteres).
                            toArray(function(err, items) {
                                if (err) {
                                    res.json(500, {error: err});
                                }
                                else {
                                    databaseConnection.collection('groupesCours').
                                            update(
                                                    {'_id': mongodb.ObjectID(id)},
                                            {$set: modificationsGroupe},
                                            function(err, result) {

                                                if (err) {
                                                    res.json(500, {error: err});
                                                } else {
                                                    res.json(200, {msg: 'OK',
                                                        nombreDocumentsAffectesParUpdate:
                                                                result});
                                                }
                                            }
                                            );
                                }
                            });
                }
            });
        }

    }
    catch (e) {
        res.json(500, {error: e});
    }
});
/**Service - 8 Supprime le groupe-cours. 
 *Il est impossible de supprimer un groupe-cours où des étudiants y sont inscrits
 */
router.delete('/groupes/:oid', function(req, res) {
    var id = req.params.oid;
    mongoDbConnection(function(databaseConnection) {
        if (mongodb.ObjectID.isValid(id)) {
            var criteres = {
                _id: mongodb.ObjectID(id)
            };
            databaseConnection.collection('groupesCours').find(criteres).
                    toArray(function(err, items) {
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
