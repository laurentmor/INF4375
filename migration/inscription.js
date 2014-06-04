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

var fs = require("fs");
var xmldom = require("xmldom");

var mongo = require("mongodb");



var DEFAULT_DOSSIERS_XML = "dossiers.xml";
var DEFAULT_INSCRIPTIONS_XML = "inscriptions.xml";
var DEFAULT_DB_NAME = "MORL05058301";
var DEFAULT_DOSSIERS_COLLECTION_NAME = "dossiers";
var DEFAULT_GC_COLLECTION_NAME = "groupesCours";
var DEFAULT_SERVER_HOST = "localhost";
var DEFAULT_PORT = 27017;
var server;
var db;
var etudiants;
var inscriptions;


server = new mongo.Server(DEFAULT_SERVER_HOST, DEFAULT_PORT);
db = new mongo.Db(DEFAULT_DB_NAME, server, {safe: true});

fs.readFile(DEFAULT_DOSSIERS_XML, function(err, data) {
    if (err) {
        console.log("Error reading XML document");
        process.exit(1);
    } else {

        var domRoot = new xmldom.DOMParser().parseFromString(data.toString());
        var etudiantsList = domRoot.getElementsByTagName("etudiant");
        if (!etudiantsList.length) {
            console.log("La liste ne contient aucun etudiant.");
            process.exit(1);
        } else {
            console.log("INFO: chargement de la liste des étudiants terminée");
            etudiants = etudiantsList;
            chargerInscriptions();

        }
    }
});

function chargerInscriptions() {
    fs.readFile(DEFAULT_INSCRIPTIONS_XML, function(err, data) {
        if (err) {
            console.log("Error reading XML document");
            process.exit(1);
        } else {

            var domRoot = new xmldom.DOMParser().parseFromString(data.toString());
            var inscriptionsList = domRoot.getElementsByTagName("inscription");
            if (!inscriptionsList.length) {
                console.log("La liste ne contient aucune inscription");
                process.exit(1);
            } else {
                console.log("INFO: chargement de la liste des incriptions terminée");
                inscriptions = inscriptionsList;
                construireCollectionDossiers();
                construireCollectionGC();



            }
        }
    });
}
function construireCollectionDossiers() {

    console.log("INFO construction de la collection Dossiers");


    db.open(function(err, db) {

        if (err) {
            console.log(err);
        }
        else
            db.collection(DEFAULT_DOSSIERS_COLLECTION_NAME, function(err, collection) {

                if (err) {
                    console.log(err);
                }
                else {
                    for (var i = 0; i < etudiants.length; i++) {
                        var etudiant = etudiants[i];
                        var e = construireEtudiantJson(etudiant);

                        collection.insert(e, function(err, result) {
                            if (err) {
                                console.log(err);
                            }

                        });
                    }
                    db.close();

                }
            });


    });


}
function construireEtudiantJson(e) {

    var nomEtd = getContenuTexteXml(e, "nom");
    var prenomEtd = getContenuTexteXml(e, "prenom");
    var codeEtd = getContenuTexteXml(e, "codePermanent");
    var sexeEtd = getContenuTexteXml(e, "sexe");
    var dateEtd = getContenuTexteXml(e, "dateNaissance");
    var listeDesCoursEtd = [];
    var listeCoursReussisEtd = [];
    for (var i = 0; i < inscriptions.length; i++) {
        var inscriptionCourante = inscriptions[i];
        var codePermCourant = getContenuTexteXml(inscriptionCourante, "etudiant");

        if (codePermCourant === codeEtd) {
            var sigleCours = getContenuTexteXml(inscriptionCourante, "sigle");
            var groupeCours = getContenuTexteXml(inscriptionCourante, "groupe");
            var sessionCours = getContenuTexteXml(inscriptionCourante, "session");
            var noteCours = getContenuTexteXml(inscriptionCourante, "noteFinale");
            var leCours = {
                sigle: sigleCours,
                groupe: groupeCours,
                session: sessionCours,
                noteFinale: parseInt(noteCours)
            };


            listeDesCoursEtd.push(leCours);
            if (leCours.noteFinale > 60) {

                listeCoursReussisEtd.push(leCours.sigle);

            }




        }




    }
    var etudiantCourant = {
        nom: nomEtd,
        prenom: prenomEtd,
        codePermanent: codeEtd,
        sexe: sexeEtd,
        dateNaissance: dateEtd,
        listeCours: listeDesCoursEtd,
        listeCoursReussis: listeCoursReussisEtd
    };

    return etudiantCourant;

}

function construireCollectionGC() {
    //Stratégie: une map à clé unique sigle cours, groupe et session concaténés
    // chaque valeur est un tableau de  cases contenant:
    //  la session,le sigle,le groupe puis un tableau de quartet cp, nom,prenom et note
    var groupesCoursMap = [];
    var listeEtd;
    for (var i = 0; i < inscriptions.length; i++) {
        //Construisons d'abord la clé pour l'inscription courante
        var inscriptionCourante = inscriptions[i];
        var cleGC = genererCle(inscriptionCourante);
        var sigleCours = getContenuTexteXml(inscriptionCourante, "sigle");
        var groupeCours = getContenuTexteXml(inscriptionCourante, "groupe");
        var sessionCours = getContenuTexteXml(inscriptionCourante, "session");
        var noteFinale = getContenuTexteXml(inscriptionCourante, "noteFinale");
        var codePermanent = getContenuTexteXml(inscriptionCourante, "etudiant");
        var tabNomPrenom = getNomPrenomEtudiant(codePermanent);


        if (!(cleGC in groupesCoursMap)) {

            listeEtd = new Array();
            //Lors qu'on rencontre une première fois le cours, 
            //on définit ses infos puis l'étudiant courant
            var infosCours = {
                sigle: sigleCours,
                groupe: groupeCours,
                session: sessionCours,
                moyenne: 0
            };
            var etudiant = {
                codePermanent: codePermanent,
                nom: tabNomPrenom[0],
                prenom: tabNomPrenom[1],
                noteFinale: parseInt(noteFinale)
            };



            //la "valeur" associée à la clé est d'abord les infos du cours
            // puis une liste vide pour pouvoir la manipuler correctement après

            groupesCoursMap[cleGC] = [infosCours, listeEtd];
            //Ajoutous l'étudiant
            groupesCoursMap[cleGC][1].push(etudiant);



        }
        else {

            var etudiant = {
                codePermanent: codePermanent,
                nom: tabNomPrenom[0],
                prenom: tabNomPrenom[1],
                noteFinale: parseInt(noteFinale)
            };
            //Ajoutous l'étudiant
            groupesCoursMap[cleGC][1].push(etudiant);

            groupesCoursMap[cleGC][1].push(etudiant);


        }

    }

    db.open(function(err, db) {
        if (err) {
            console.log(err);
        }
        else {
            var cles = Object.keys(groupesCoursMap);
            for (var k = 0; k < cles.length; k++) {
                produireMoyenne(groupesCoursMap[cles[k]]);
                var groupeCours=groupesCoursMap[cles[k]];
                 collection.insert(groupeCours, function(groupeCours, result) {
                            if (err) {
                                console.log(err);
                            }

                        });
            }
        }
        db.close();
    });


}
/**
 * 
 * @param {type} ins l'élément XML inscription courant
 * @returns {String} une clé unique pour la Map GroupeCours 
 */
function genererCle(ins) {
    var cle = "";
    if (!(ins === "undefined")) {
        cle = getContenuTexteXml(ins, "sigle") +
                getContenuTexteXml(ins, "groupe") +
                getContenuTexteXml(ins, "session");
    }
    return cle;
}
/**
 * retourne le contenu texte d'une balise avant le parent spécifé dans le XML
 * @param {type} parent 
 * @param {type} balise
 * @returns {unresolved}
 */
function getContenuTexteXml(parent, balise) {
    return parent.getElementsByTagName(balise)[0].textContent;
}
/**
 *  
 * @param {type} codep 
 * @returns {Array} un tableau contenant le nom et prenom basé sur le code permanent
 */
function getNomPrenomEtudiant(codep) {
    var tab = [];
    for (var i = 0; i < etudiants.length; i++) {
        var e = etudiants[i];
        if (getContenuTexteXml(e, "codePermanent") === codep) {
            tab[0] = getContenuTexteXml(e, "nom");
            tab[1] = getContenuTexteXml(e, "prenom");
            return tab;
        }
    }
}
function produireMoyenne(gc) {
    var somme = 0;
    var nb_etd = gc[1].length;
    var moyenne = 0;

    for (var i = 0; i < nb_etd; i++) {
        somme += gc[1][i].noteFinale;

    }
    moyenne = (somme / nb_etd).toFixed(2);
    gc[0].moyenne = moyenne;



}



