/**
 * Created by laurent on 2014-07-04.
 */
var dataUpdated = false;
var dataAdded=false;
var updatedFieldID;
var displayInModal=false;
$(document).ready(function () {
    gererEdition();
    gereDelete();
    gereNouveau();
    gererPicker();

});

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
    var element = document.getElementById("resultModal");

    if (jQuery("#resultModal").hasClass("alert-success")) {
        jQuery("#resultModal").removeClass("alert-success");
        //noinspection JSJQueryEfficiency
        jQuery("#resultModal").addClass("alert-info");
        //Petit FIX pour corriger un bug d'ajout de class sur un div (non-modal) sans infos au moment du reset
        jQuery("#result").removeClass("alert-success");
    }
    else if (jQuery("#resultModal").hasClass("alert-danger")) {
        jQuery("#resultModal").removeClass("alert-danger");
        jQuery("#resultModal").addClass("alert-info");
        jQuery("#result").removeClass("alert-danger");
    }
    element.innerHTML = "Les changements sont sauvegardés automatiquement.";
    displayInModal=false;

}
function update() {
    var objectToUpdate = buildObject();
    displayInModal=true;
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

function displayResult(status,message) {
    var element;
    if(displayInModal==true){
        element = document.getElementById("resultModal");
        if (status == 200) {

            $("#resultModal").removeClass("alert-info").addClass("alert-success");
            element.innerHTML=message;

        }
        else {


            $("#resultModal").addClass("alert-danger");
            element.innerHTML =message;


        }
    }
    else{
        element = document.getElementById("result");
    }
    if (status == 200) {

        $("#result").addClass("alert-success");
        element.innerHTML=message;

    }
    else {

        $("#result").addClass("alert-danger");
        element.innerHTML =message;


    }
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
            var infoToRefreshID="etudiants";

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
        if (xhr.readyState <= 4 && xhr.status === 200) {
            callback(200,JSON.parse(xhr.responseText).message);
        }
        else {

            callback(500,JSON.parse(xhr.responseText).error);
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
            callback(200,JSON.parse(xhr.responseText).message);

        }
        else {

            callback(500,JSON.parse(xhr.responseText).error);
        }
    };

    xhr.send();
}
function postToServer(data, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "/dossiers", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var  retour=JSON.parse(xhr.responseText);
            callback(200,retour.message);
            dataAdded=true;

            //setTimeout(resetMessages(),5000);
            refreshHomePage();

        }
        else {
            //BUG:Uncaught SyntaxError: Unexpected end of input
            var  retour=JSON.parse(xhr.responseText);
            callback(500,retour.error);
            //setTimeout(resetMessages(),5000);

        }
    };

    var jsonData = JSON.stringify(data);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}
function resetMessages(){
    if($("#result").hasClass("alert-danger")){
        $("#result").removeClass("alert-danger");
    }
    else if($("#result").hasClass("alert-success")){
        $("#result").removeClass("alert-success");

    }
    var element = document.getElementById("result");
    element.innerHTML="";
}