function charger() {
    document.getElementById('input-heure').onclick = function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var objet = JSON.parse(xhr.responseText);
                document.getElementById('info').innerHTML = "Il est : " + objet.heure + ":" + objet.minute + ":" + objet.seconde;
            }
        };
        xhr.open("GET", "/heure", true);
        xhr.send(null);
    }
    document.getElementById('input-date').onclick = function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var objet = JSON.parse(xhr.responseText);
                document.getElementById('info').innerHTML = "Nous sommes le  : " + objet.annee + "/" + objet.mois + "/" + objet.jour;
            }
        };
        xhr.open("GET", "/date", true);
        xhr.send(null);
    }
}
