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
 * Module pour la validation d'objets JSON
 * et d'autres choses comme le code permanent
 * REF des schémas: http://www.jsonschema.net/
 */
var inspector = require('schema-inspector');
var regExCp=/([a-zA-ZÀ-ÿ]{4})\d{8}/;
var schemaDefinitionDossier = {
    "type": "object",
    "$schema": "http://json-schema.org/draft-03/schema",
    "required": true,
    "properties": {
        "codePermanent": {
            "type": "string",
            "required": true
        },
        "dateNaissance": {
            "type": "string",
            "required": true
        },
        "listeCoursReussis": {
            "type": "array",
            "optional":true,
            "items":
                    {
                        "type": "string",
                        "required": false
                    }


        },
        "listeCours": {
            "type": "array",
            "optional":true,
            "items":
                    {
                        "type": "object",
                        "required": false,
                        "properties": {
                            "groupe": {
                                "type": "string",
                                "required": false
                            },
                            "noteFinale": {
                                "type": "string",
                                "required": false
                            },
                            "session": {
                                "type": "string",
                                "required": false
                            },
                            "sigle": {
                                "type": "string",
                                "required": false
                            }
                        }
                    }


        },
        "nom": {
            "type": "string",
            "required": true
        },
        "prenom": {
            "type": "string",
            "required": true
        },
        "sexe": {
            "type": "string",
            "required": true
        }
    }
};
var schemaDefinitionGroupeCours = {
    "type": "object",
    "$schema": "http://json-schema.org/draft-03/schema",
    "required": true,
    "properties": {
        "groupe": {
            "type": "string",
            "required": true
        },
        "listeEtudiants": {
            "type": "array",
            "required": true,
            "items":
                    {
                        "type": "object",
                        "required": true,
                        "properties": {
                            "codePermanent": {
                                "type": "string",
                                "required": true
                            },
                            "nom": {
                                "type": "string",
                                "required": true
                            },
                            "noteFinale": {
                                "type": "number",
                                "required": true
                            },
                            "prenom": {
                                "type": "string",
                                "required": true
                            }
                        }
                    }


        },
        "moyenne": {
            "type": "string",
            "required": true
        },
        "session": {
            "type": "string",
            "required": true
        },
        "sigle": {
            "type": "string",
            "required": true
        }
    }
};
function validerDossier(dossier) {
    console.log("[INFO] Validation du dossier");
    var validation = inspector.validate(schemaDefinitionDossier, dossier);
    console.log(validation.valid);

    return validation;
}

function validerGroupe(groupe) {
    console.log("[INFO] Validation du groupe-cours");
    var validation = inspector.validate(schemaDefinitionGroupeCours, groupe);

    return validation;
}
function validerCodePermanent(code){
    return regExCp.test(code);
}
exports.validerDossier = validerDossier;
exports.validerGroupe = validerGroupe;
exports.validerCodePermanent=validerCodePermanent;

