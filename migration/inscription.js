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
//TODO add more requires when needed
var DEFAULT_DOSSIERS_XML = "dossiers.xml";
var DEFAULT_INSCRIPTIONS_XML = "inscriptions.xml";
var DEFAULT_DB_NAME = "MORL05058301";
var DEFAULT_DOSSIERS_COLLECTION_NAME = "dossiers";
var DEFAULT_GC_COLLECTION_NAME = "groupesCours";

var etudiants;
var inscriptions;
var dossiers;

var assertFileExists = function(aFile) {
    var fStr = aFile.toString();
    if (!fs.existsSync(fStr)) {
        console.log("%s does not exist. Exiting.", fStr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return fStr;
};
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
        } else {
            // Le fichier XML est retourné sous forme d'un buffer. Nous devons le
            // transgormer en chaîne de caractères avant de l'envoyer au parser DOM.
            var domRoot = new xmldom.DOMParser().parseFromString(data.toString());
            var inscriptionsList = domRoot.getElementsByTagName("inscription");
            if (!inscriptionsList.length) {
                console.log("La liste ne contient aucune inscription");
                process.exit(1);
            } else {
                console.log("INFO: chargement de la liste des incriptions terminée");
                inscriptions = inscriptionsList;
                construireCollectionDossiers();


            }
        }
    });
}
function construireCollectionDossiers(){
    console.log(etudiants.length)
    for(var i=0;i<etudiants.length;i++)
        var etudiantCourant=etudiants[i];
        aff(etudiantCourant);
  
}
function aff(etd){
    
    console.log(etd.getElementsByTagName("codePermanent")[0].textContent);
}






