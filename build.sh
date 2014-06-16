#!/bin/sh
echo "Build script pour les TP"
cd migration
npm install
node migration.js
cd ..
echo "Fin"
