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
| Supprime le groupe-cours.                                           |   |   |   |   | DELETE  | /groupes/:oid |   |                                |   |   |                      |
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





