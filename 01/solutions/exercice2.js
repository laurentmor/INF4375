function charger() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data/livre.xml", false);
    xhr.send();


    var livres = xhr.responseXML.getElementsByTagName('livre');
    var tableau = document.getElementsByTagName('table')[0];
    tableau.innerHTML = "<tr><td>Nom</td><td>Auteur(s)</td><td>Prix</td></tr>";

        
    for(var i = 0; i < livres.length; i++) {
        var livre = livres[i];

        var auteurs = livre.getElementsByTagName('auteur');
        var auteur_html = "";
        for(var j = 0; j < auteurs.length; j++) {
            auteur_html += auteurs[j].textContent;
            if(j < auteurs.length-1) {
                auteur_html += ", ";
            }
        }

        tableau.innerHTML += "<tr><td>" + livre.getElementsByTagName('nom')[0].textContent + "</td><td>" + auteur_html + "</td><td>" + livre.getElementsByTagName('prix')[0].textContent + "</tr>";

    }
}
