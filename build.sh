#!/bin/sh
echo "Build script pour les TP"
cd migration
npm install
node migration.js
mongo
3-2
exit
cd ..
echo "Fin"
