/**
 * Created by laurent on 2014-07-04.
 */
var dataUpdated = false;
var dataAdded=false;
var updatedFieldID;
$(document).ready(function () {
    gererEdition();
    gereDelete();
    gereNouveau();
    gererPicker();
    gererRetour();

});
function gererRetour(){
    jQuery('#retour').on('click',function(){
        refreshHomePage();
    });
}
function gereDelete(){
    jQuery('#delete').on('click',function(){
     remove();
    });
}
function gereNouveau(){
    jQuery('#nouveau').on('click',function(){
        // just for the demos, avoids form submit
        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });


        var form = $( "#nouveau-form" );
        form.validate();
        if(form.valid())add();
    });


}
function gererPicker() {

        $("#form-dateNaissance").datepicker({
            showOn: 'button',
            buttonText: 'Choisir une date',
            buttonImageOnly: true,
            buttonImage: '/images/calendar.gif'
        });





}
function gererEdition() {
    jQuery('.edit').on('input', function () {
        dataUpdated = true;
        update();
        updatedFieldID=this.id;
    });
    jQuery('.close-edit').on('click', function () {
        reset();
        if (dataUpdated)refreshEditPage();
    });

}
function reset() {
    var element = document.getElementById("result");

    if (jQuery("#result").hasClass("alert-success")) {
        jQuery("#result").removeClass("alert-success");
        //noinspection JSJQueryEfficiency
        jQuery("#result").addClass("alert-info");
    }
    else if (jQuery("#result").hasClass("alert-danger")) {
        jQuery("#result").removeClass("alert-danger");
        jQuery("#result").addClass("alert-info");
    }
    element.innerHTML = "Les changements sont sauvegardés automatiquement.";
}
function update() {
    var objectToUpdate = buildObject();
    updateToServer(objectToUpdate, displayResult);
}
function remove(){

    deleteOnServer(displayResult);
}
function add(){
    var result = {};
    result.nom = document.getElementById("form-nom").value;
    result.prenom = document.getElementById("form-prenom").value;
    result.dateNaissance = document.getElementById("form-dateNaissance").value;
    result.codePermanent = document.getElementById("form-cp").value;
    result.sexe = document.getElementById("form-sexe").value;

    postToServer(result,displayResult);
    if(dataAdded) refreshHomePage();

}

function buildObject() {
    var result = {};
    result.nom = document.getElementById("form-nom").value;
    result.prenom = document.getElementById("form-prenom").value;
    result.dateNaissance = document.getElementById("form-dateNaissance").value;
    result.codePermanent = document.getElementById("form-cp").value;
    result.sexe = document.getElementById("form-sexe").value;
    result.listeCours = [];
    result.listeCoursReussis = [];
    var lesCours = document.getElementsByClassName('uncours');
    for (var i = 0; i < lesCours.length; i++) {
        var unCours = {};
        var data = lesCours[i].getElementsByTagName("td");
        unCours.sigle = data[0].textContent;
        unCours.groupe = data[1].textContent;
        unCours.session = data[2].textContent;
        unCours.noteFinale = data[3].textContent
        result.listeCours.push(unCours);
        if (parseInt(unCours.noteFinale) >= 60) {
            result.listeCoursReussis.push(unCours.sigle);
        }
    }

    return result;
}

function displayResult(optype,status) {
    var element = document.getElementById("result");
    var message;
    if(optype=="Suppression"){
        if(status==500)message=optype+" impossible l'étudiant(e) a déjà réussi un cours et ne peut pas être supprimé(e)";
        $("#result").addClass("alert-danger");

    }
    else{

    if (status == 200) {
        $("#result").removeClass("alert-info").addClass("alert-success");
         message="Opération "+optype+" effectuée correctement";


    }
    else {
        $("#result").removeClass("alert-info").addClass("alert-danger");
        message = "Opération "+optype+" Impossible, vérifiez vos données";
    }
   }
    element.innerHTML = message;
}

function refreshEditPage() {
    var xhr = new XMLHttpRequest();
    var cp = document.getElementById("form-cp").value;
    xhr.open("GET", "/dossiers/" + cp, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var res = $.parseXML(xhr.responseText);
            var infoToRefreshID=updatedFieldID.split("-")[1];

            document.getElementById(infoToRefreshID).innerHTML = res.getElementById(infoToRefreshID).innerHTML;


        }

    };

    xhr.setRequestHeader("Content-type", "text/html");

    xhr.send();
}
function refreshHomePage() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var res = $.parseXML(xhr.responseText);
            var infoToRefreshID="contenu";

            document.getElementById(infoToRefreshID).innerHTML = res.getElementById(infoToRefreshID).innerHTML;


        }

    };

    xhr.setRequestHeader("Content-type", "text/html");

    xhr.send();
}
function updateToServer(updateObject, callback) {
    var xhr = new XMLHttpRequest();
    var cp = document.getElementById("form-cp").value;
    xhr.open("PUT", "/dossiers/" + cp, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback("Mise à jour",xhr.status);
        }
        else {
            callback("Mise à jour",xhr.status);
        }
    };
    var jsonData = JSON.stringify(updateObject);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}
function deleteOnServer(callback) {
    var xhr = new XMLHttpRequest();
    var cp = document.getElementById("form-cp").value;
    xhr.open("DELETE", "/dossiers/" + cp, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback("Suppression",xhr.status);

        }
        else {
            callback("Suppression",xhr.status);
        }
    };

    xhr.send();
}
function postToServer(data, callback) {
    var xhr = new XMLHttpRequest();
    var cp = document.getElementById("form-cp").value;
    xhr.open("POST", "/dossiers/", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback("Ajout",xhr.status);
            dataAdded=true;
        }
        else {
            callback("Ajout",xhr.status);
        }
    };
    var jsonData = JSON.stringify(data);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}