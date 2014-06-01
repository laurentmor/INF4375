/* 
 * The MIT License
 *
 * Copyright 2014 laurent.
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
var xjs = require("xml2js");
var mongo = require("mongodb");

//TODO add more requires when needed

var DEFAULT_DOSSIERS_XML = "dossiers.xml";
var DEFAULT_INSCRIPTIONS_XML = "inscriptions.xml";
var DEFAULT_DB_NAME = "MORL05058301";
var DEFAULT_DOSSIERS_COLLECTION_NAME = "dossiers";
var DEFAULT_GC_COLLECTION_NAME = "groupesCours";
var DEFAULT_SERVER_HOST = "localhost";
var DEFAULT_PORT = 27017;

var etudiants;
var inscriptions;
var dossiers = [];


// Lecture du fichier XML en mémoire.
fs.readFile(DEFAULT_DOSSIERS_XML, function(err, data) {
    if (err) {
        console.log("Error reading XML document");
    } else {
        // Le fichier XML est retourné sous forme d'un buffer. Nous devons le
        // transgormer en chaîne de caractères avant de l'envoyer au parser DOM.
        var domRoot = new xmldom.DOMParser().parseFromString(data.toString());
        var etudiantsList = domRoot.getElementsByTagName("etudiant");
        if (!etudiantsList.length) {
            console.log("La liste ne contient aucun etudiant.");
            process.exit(1);
        } else {
            //console.log("INFO: chargement de la liste des étudiants terminée");
            etudiants = etudiantsList;
            chargerInscriptions();

        }
    }
});

function chargerInscriptions() {
    fs.readFile(DEFAULT_INSCRIPTIONS_XML, function(err, data) {
        if (err) {
            console.log("Error reading XML document");
        } else {
            // Le fichier XML est retourné sous forme d'un buffer. Nous devons le
            // transgormer en chaîne de caractères avant de l'envoyer au parser DOM.
            var domRoot = new xmldom.DOMParser().parseFromString(data.toString());
            var inscriptionsList = domRoot.getElementsByTagName("inscription");
            if (!inscriptionsList.length) {
                console.log("La liste ne contient aucune inscription");
                process.exit(1);
            } else {
                //console.log("INFO: chargement de la liste des incriptions terminée");
                inscriptions = inscriptionsList;
                construireCollectionDossiers();



            }
        }
    });
}
function construireCollectionDossiers() {

    //console.log("INFO construction de la collection Dossiers");



var server = new mongo.Server(DEFAULT_SERVER_HOST, DEFAULT_PORT);
var db = new mongo.Db(DEFAULT_DB_NAME, server, {safe: true});
db.open(function(err, db) {

    if (err) {
        console.log(err);
    }
    else
        db.collection(DEFAULT_DOSSIERS_COLLECTION_NAME, function(err, collection) {

            if (err) {
                console.log(err);
            }
            else{
                for (var i = 0; i < etudiants.length; i++) {
                    var etudiant = etudiants[i];
                    var e = construireEtudiantJson(etudiant);

                    collection.insert(e, function(err, result) {
                        if (err) {
                            console.log("AAAAA"+err);
                        }
                       console.log(result);
                    });
                }
                 collection.find().toArray(function (err, data) {
          for (var i = 0; i < data.length; i++) {
            var d = data[i];
            console.log(d.nom);
          }

          // On ferme la connexion à la base de données.
          db.close();
        });
           // db.close();
            }
        });
   

});
 

}
function construireEtudiantJson(e) {

    var nomEtd = e.getElementsByTagName("nom")[0].textContent;
    var prenomEtd = e.getElementsByTagName("prenom")[0].textContent;
    var codeEtd = e.getElementsByTagName("codePermanent")[0].textContent;
    var sexeEtd = e.getElementsByTagName("sexe")[0].textContent;
    var dateEtd = e.getElementsByTagName("dateNaissance")[0].textContent;
    var listeDesCoursEtd = [];
    var listeCoursReussisEtd = [];
    for (var i = 0; i < inscriptions.length; i++) {
        var inscriptionCourante = inscriptions[i];
        var codePermCourant = inscriptionCourante.getElementsByTagName("etudiant")[0].textContent;

        if (codePermCourant === codeEtd) {
            var sigleCours = inscriptionCourante.
                    getElementsByTagName("sigle")[0].textContent;
            var groupeCours = inscriptionCourante.
                    getElementsByTagName("groupe")[0].textContent;
            var sessionCours = inscriptionCourante.
                    getElementsByTagName("session")[0].textContent;
            var noteCours = inscriptionCourante.
                    getElementsByTagName("noteFinale")[0].textContent;
            var leCours = {
                sigle: sigleCours,
                groupe: groupeCours,
                session: sessionCours,
                noteFinale: noteCours
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





