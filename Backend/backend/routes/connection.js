var serverInfos={
    host : "localhost",
    port : 27017,
    db:"MORL05058301"
};
var mongodb = require("mongodb");

// instance de la base de données
var instanceMongoDB;


// Implémentation d'un Singleton
module.exports = function(callback) {

    if (instanceMongoDB) {
        console.log("[Singleton] Retour instance MongoDB existante.");
        callback(instanceMongoDB);
        return;
    }

    var server = new mongodb.Server(serverInfos.host, serverInfos.port, {auto_reconnect: true});
    var db = new mongodb.Db(serverInfos.db, server, {safe: true});

    // Vérification de db.openCalled pour éviter d'appeler db.open(...)
    // plusieurs fois avant l'appel du callback
    if (!db.openCalled) {

        db.open(function(error, dbConn) {

            if (error) {
                throw new Error(error);
            }
            console.log("[Singleton] Retour nouvelle instance MongoDB.");
            
            instanceMongoDB = dbConn;
            callback(instanceMongoDB);
        });
    }
};