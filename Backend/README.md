Ce projet est composé des Services REST pour la gestion des dossiers étudiant et des groupes-cours
Réalisé en juin 2014 dans le cadre du cours INF4375
Pour [Jacques Berger ](https://github.com/jacquesberger) (et pour moi aussi :))
Fonctionalités
==============
| Service                                                             |   |   |   |   | Méthode | URL           |   | Données entrée                 |   |   | Sortie               |
|---------------------------------------------------------------------|---|---|---|---|---------|---------------|---|--------------------------------|---|---|----------------------|
| Envoie au client le dossier complet de l'étudiant                   |   |   |   |   | GET     | /dossiers/:cp |   | Code permanent                 |   |   | Dossier en JSON      |
| Ajoute un dossier étudiant                                          |   |   |   |   | POST    | /dossiers     |   | Dossier en JSON                |   |   | Statut de requête    |
| Reçoit du client l'ensemble des modifications à apporter au dossier |   |   |   |   | PUT     | /dossiers/:cp |   | Code permanent+changements     |   |   | Statut de requête    |
| Supprime le dossier de l'étudiant.                                  |   |   |   |   | DELETE  | /dossiers/:cp |   | Code permanent                 |   |   | Statut de requête    |
| Envoie au client le groupeCours                                     |   |   |   |   | GET     | /groupes/:oid |   | ObjectID du Groupe             |   |   | Groupe-Cours en JSON |
| ajoute un groupe-cours                                              |   |   |   |   | POST    | /groupes/     |   | Groupe-Cours en JSON           |   |   | Statut de requête    |
| Mettre à jour un Groupe-cours                                       |   |   |   |   | PUT     | /groupes/:oid |   | ObjectID du Groupe+changements |   |   | Statut de requête    |
| Supprime le groupe-cours.                                           |   |   |   |   | DELETE  | /groupes/:oid |   | ObjectID du Groupe+changements |   |   | Statut de requête    |

Prérequis:
==========
* node: 0.10.24+
* MongoDB:2.6+

Commandes pour construire la BD
===================================
1. Démarrer d'abord votre serveur mongo
2. puis exécuter ceci:
```Shell
  cd <Répertoire racine>\Backend\migration
  npm install
  node migration
```
3. À l'aide d'un client mongo exécuter ceci:
```Shell
use MORL05058301
show collections
```
afin de vérifier que la création de la BD est correcte
Résultats attendus des commandes
--------------------------------
```Shell
Dossiers
GroupesCours
```


Commandes pour démarrer le serveur
================================
```Shell
  cd <Répetoire racine>\Backend\
  npm install
  npm start
```
Exemples de donnée JSON
=======================
* Dossier
```JSON
{
     
        "nom" : "Pelletier",
        "prenom" : "Chantal",
        "codePermanent" : "PELC88591901",
        "sexe" : "2",
        "dateNaissance" : "1988-09-19",
        "listeCours" : [
                {
                        "sigle" : "INF2015",
                        "groupe" : "40",
                        "session" : "20141",
                        "noteFinale" : 41
                },
                {
                        "sigle" : "INF4150",
                        "groupe" : "30",
                        "session" : "20141",
                        "noteFinale" : 70
                },
                {
                        "sigle" : "INF4170",
                        "groupe" : "30",
                        "session" : "20141",
                        "noteFinale" : 72
                },
                {
                        "sigle" : "INF2015",
                        "groupe" : "10",
                        "session" : "20133",
                        "noteFinale" : 45
                }
        ],
        "listeCoursReussis" : [
                "INF4150",
                "INF4170"
        ]
}
```
* Groupe-Cours
```JSON
{
        
        "sigle" : "INF4375",
        "groupe" : "20",
        "session" : "20142",
        "moyenne" : "68.63",
        "listeEtudiants" : [
                {
                        "codePermanent" : "CYRC72560101",
                        "nom" : "Cyr",
                        "prenom" : "Clara",
                        "noteFinale" : 98
                },
                {
                        "codePermanent" : "MERM89590101",
                        "nom" : "Mercier",
                        "prenom" : "Maélie",
                        "noteFinale" : 73
                },
                {
                        "codePermanent" : "LAPO91602401",
                        "nom" : "Lapierre",
                        "prenom" : "Olivia",
                        "noteFinale" : 35
                },
                {
                        "codePermanent" : "DIOC90552101",
                        "nom" : "Dion",
                        "prenom" : "Clara",
                        "noteFinale" : 60
                },
                {
                        "codePermanent" : "SAIO77612201",
                        "nom" : "Saint-Pierre",
                        "prenom" : "Océane",
                        "noteFinale" : 99
                },
                {
                        "codePermanent" : "VACN55551301",
                        "nom" : "Vachon",
                        "prenom" : "Noémie",
                        "noteFinale" : 93
                },
                {
                        "codePermanent" : "SAIE73510901",
                        "nom" : "Saint-Pierre",
                        "prenom" : "Elizabeth",
                        "noteFinale" : 75
                },
                {
                        "codePermanent" : "GOSL79572301",
                        "nom" : "Gosselin",
                        "prenom" : "Louise",
                        "noteFinale" : 57
                },
                {
                        "codePermanent" : "MORO57102301",
                        "nom" : "Moreau",
                        "prenom" : "Olivier",
                        "noteFinale" : 63
                },
                {
                        "codePermanent" : "BILB73102701",
                        "nom" : "Bilodeau",
                        "prenom" : "Benjamin",
                        "noteFinale" : 96
                },
                {
                        "codePermanent" : "THEE83552801",
                        "nom" : "Therrien",
                        "prenom" : "Emma",
                        "noteFinale" : 47
                },
                {
                        "codePermanent" : "NADÉ91120901",
                        "nom" : "Nadeau",
                        "prenom" : "Édouard",
                        "noteFinale" : 64
                },
                {
                        "codePermanent" : "JACJ91042501",
                        "nom" : "Jacques",
                        "prenom" : "Jérémy",
                        "noteFinale" : 88
                },
                {
                        "codePermanent" : "MERC64101201",
                        "nom" : "Mercier",
                        "prenom" : "Cédric",
                        "noteFinale" : 41
                },
                {
                        "codePermanent" : "GUAL74081901",
                        "nom" : "Guay",
                        "prenom" : "Léo",
                        "noteFinale" : 86
                },
                {
                        "codePermanent" : "ROYÉ64060201",
                        "nom" : "Roy",
                        "prenom" : "Éthan",
                        "noteFinale" : 91
                },
                {
                        "codePermanent" : "AUDL83512801",
                        "nom" : "Audet",
                        "prenom" : "Louise",
                        "noteFinale" : 63
                },
                {
                        "codePermanent" : "DESG78030701",
                        "nom" : "Deschênes",
                        "prenom" : "Guillaume",
                        "noteFinale" : 68
                },
                {
                        "codePermanent" : "BERO79042601",
                        "nom" : "Bernard",
                        "prenom" : "Olivier",
                        "noteFinale" : 66
                },
                {
                        "codePermanent" : "MORJ89102401",
                        "nom" : "Moreau",
                        "prenom" : "Jonathan",
                        "noteFinale" : 70
                },
                {
                        "codePermanent" : "HOUA59562701",
                        "nom" : "Houle",
                        "prenom" : "Arianne",
                        "noteFinale" : 85
                },
                {
                        "codePermanent" : "GOUE81592001",
                        "nom" : "Goulet",
                        "prenom" : "Elizabeth",
                        "noteFinale" : 94
                },
                {
                        "codePermanent" : "LESM81601001",
                        "nom" : "Lessard",
                        "prenom" : "Marianne",
                        "noteFinale" : 88
                },
                {
                        "codePermanent" : "LALD57030301",
                        "nom" : "Lalonde",
                        "prenom" : "Dylan",
                        "noteFinale" : 95
                },
                {
                        "codePermanent" : "HAMM62071601",
                        "nom" : "Hamel",
                        "prenom" : "Maxime",
                        "noteFinale" : 61
                },
                {
                        "codePermanent" : "CHAF69042701",
                        "nom" : "Charbonneau",
                        "prenom" : "Félix",
                        "noteFinale" : 38
                },
                {
                        "codePermanent" : "LEGJ89091501",
                        "nom" : "Legault",
                        "prenom" : "Justin",
                        "noteFinale" : 38
                },
                {
                        "codePermanent" : "FONA89622201",
                        "nom" : "Fontaine",
                        "prenom" : "Arianne",
                        "noteFinale" : 58
                },
                {
                        "codePermanent" : "BOUM86531001",
                        "nom" : "Bouchard",
                        "prenom" : "Maika",
                        "noteFinale" : 92
                },
                {
                        "codePermanent" : "ROYA58062101",
                        "nom" : "Roy",
                        "prenom" : "Adam",
                        "noteFinale" : 41
                },
                {
                        "codePermanent" : "RENT81031001",
                        "nom" : "Renaud",
                        "prenom" : "Thomas",
                        "noteFinale" : 82
                },
                {
                        "codePermanent" : "MICC70520101",
                        "nom" : "Michaud",
                        "prenom" : "Camille",
                        "noteFinale" : 40
                },
                {
                        "codePermanent" : "LEMJ79101601",
                        "nom" : "Lemieux",
                        "prenom" : "Jacob",
                        "noteFinale" : 59
                },
                {
                        "codePermanent" : "LEPM64550501",
                        "nom" : "Lepage",
                        "prenom" : "Mia",
                        "noteFinale" : 69
                },
                {
                        "codePermanent" : "LECA81010301",
                        "nom" : "Leclerc",
                        "prenom" : "Alexandre",
                        "noteFinale" : 77
                },
                {
                        "codePermanent" : "BEAM65521501",
                        "nom" : "Beaulieu",
                        "prenom" : "Maude",
                        "noteFinale" : 82
                },
                {
                        "codePermanent" : "BILÉ75601401",
                        "nom" : "Bilodeau",
                        "prenom" : "Élodie",
                        "noteFinale" : 35
                },
                {
                        "codePermanent" : "RICM69521801",
                        "nom" : "Richard",
                        "prenom" : "Maika",
                        "noteFinale" : 41
                }
        ]
}

```
Dépendences
============
backend@0.0.1 
* body-parser@1.0.2
  * qs@0.6.6
  * raw-body@1.1.7
  * bytes@1.0.0
    * string_decoder@0.10.25-1
    * type-is@1.1.0
   * mime@1.2.11
 *  cookie-parser@1.0.1
  * cookie@0.1.0
  * cookie-signature@1.0.3
 * debug@0.7.4
 * express@4.2.0
  * accepts@1.0.1
  * mime@1.2.11
   * negotiator@0.4.6
  * buffer-crc32@0.2.1
  * cookie@0.1.2
  * cookie-signature@1.0.3
  * debug@0.8.1
  * escape-html@1.0.1
  * fresh@0.2.2
  * merge-descriptors@0.0.2
  * methods@1.0.0
  * parseurl@1.0.1
  * path-to-regexp@0.1.2
  * qs@0.6.6
  * range-parser@1.0.0
  * send@0.3.0
   * debug@0.8.0
   * mime@1.2.11
  * serve-static@1.1.0
  * type-is@1.1.0
   * mime@1.2.11
  * utils-merge@1.0.0
 * jade@1.3.1
  * character-parser@1.2.0
  * commander@2.1.0
  * constantinople@2.0.0
   * uglify-js@2.4.14
     * async@0.2.10
     * optimist@0.3.7
      * wordwrap@0.0.2
     * source-map@0.1.34
      * amdefine@0.1.0
     * uglify-to-browserify@1.0.2
  * mkdirp@0.3.5
  * monocle@1.1.51
   * readdirp@0.2.5
    * minimatch@0.3.0
       * lru-cache@2.5.0
       * sigmund@1.0.0
  * transformers@2.1.0
   * css@1.0.8
    * css-parse@1.0.4
    * css-stringify@1.0.5
   * promise@2.0.0
    * is-promise@1.0.1
   * uglify-js@2.2.5
     * optimist@0.3.7
      * wordwrap@0.0.2
     * source-map@0.1.34
       * amdefine@0.1.0
  * with@3.0.0
    * uglify-js@2.4.14
      * async@0.2.10
      * optimist@0.3.7
      * wordwrap@0.0.2
      * source-map@0.1.34
       * amdefine@0.1.0
      * uglify-to-browserify@1.0.2
 * mongodb@1.4.7
  * bson@0.2.9
  * nan@1.0.0
  * kerberos@0.0.3
  * readable-stream@1.0.27-1
     * core-util-is@1.0.1
    * inherits@2.0.1
    * isarray@0.0.1
    * string_decoder@0.10.25-1
 * morgan@1.0.1
 * bytes@0.3.0
 * schema-inspector@1.4.2
 * async@0.9.0
 * static-favicon@1.0.2





