var express = require('express');
var mongodb = require('mongodb');
var createSchema = require('json-gate').createSchema;

var mongoDbConnection = require('./connection.js');

var BSON = mongodb.BSONPure;
var router = express.Router();

//Service - 1 Envoie au client le dossier complet de l'étudiant, en format JSON 
router.get('/dossiers/:cp', function(req, res) {
    var leCode=req.params.cp;
    //TODO valider le cp
    mongoDbConnection(function(databaseConnection) {
        var criteres={
            codePermanent:leCode
        };
        databaseConnection.collection('dossiers').find(criteres).toArray(function(err, items) {
            res.json(items);
        });
    });
});

// service - 5 Envoie au client le groupeCours  en format JSON 
router.get('/groupes/:oid', function(req, res) {
    var id=req.params.oid;
    
    mongoDbConnection(function(databaseConnection) {
        if(mongodb.ObjectID.isValid(id)){
        var criteres={
            _id:mongodb.ObjectID(id)
        };
        
            console.log("OK");
        databaseConnection.collection('groupesCours').find(criteres).toArray(function(err, items) {
            res.json(items);
        });
    }
    });
});
module.exports = router;
