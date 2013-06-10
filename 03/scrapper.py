# -*- coding: utf-8 -*-
import lxml.html, urllib, urllib2
import re
import json

base_url = "http://www.websysinfo.uqam.ca/regis/"
f = urllib2.urlopen("%sPKG_WPUB.AFFICHE_CHEMINEMENT?P_prog=7316" % base_url)
data = lxml.html.fromstring(f.read())
f.close()
liste_cours = {}
for cours in data.cssselect("ul.liste li"):
    cour = cours.cssselect("a")[0]
    prerequis = []
    for p in cours.cssselect("a")[1:]:
        prerequis.append(p.text_content().strip())

    sigle = cour.text_content().strip()
    url = "%s%s&an_ses2=Automne+2013" % (base_url, cour.attrib['href'])
    f = urllib2.urlopen(url)
    data_cours = f.read()
    nom = re.sub(sigle, '', lxml.html.fromstring(data_cours).cssselect("p.rtitredepage")[0].text_content().strip()).strip()

    liste_cours[sigle] = {'nom': nom, 'url': url, 'offert': True, 'prerequis': prerequis}
    print sigle, prerequis
    if "Ce cours n'est pas offer" in data_cours:
        liste_cours[sigle]['offert'] = False

with open('cours_automne_2013.json', 'wb') as fp:
    json.dump(liste_cours, fp)


