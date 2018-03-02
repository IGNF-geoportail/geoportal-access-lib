#!/bin/bash

# Script de construction des bundles

##########
# doCmd()

doCmd () {
    cmd2issue=$1
    eval ${cmd2issue}
    retour=$?
    if [ $retour -ne 0 ] ; then
        printTo "Erreur d'execution (code:${retour}) !..."
        exit 100
    fi
}

##########
# printTo()

printTo () {
    text=$1
    d=`date`
    echo "[${d}] ${text}"
}

printTo "BEGIN"

function production() {
  printTo "####### production !"
  doCmd "npm run build -- --env.production"
}

function sources() {
  printTo "####### sources !"
  doCmd "npm run build"
}

doCmd "npm run setup"

while getopts "aps" opts
do
   case $opts in
     p)
        printTo "#################################"
        printTo "##### production bundle ! #######"
        production
        ;;
     s)
        printTo "#################################"
        printTo "###### sources bundle ! ######"
        sources
        ;;
     a)
        printTo "#################################"
        printTo "########## ALL bundle ! #########"
        sources
        production
        ;;
     \?)
        printTo "$OPTARG : option invalide : a(all), s(sources) ou p(production) !"
        exit -1
        ;;
   esac
done

printTo "END"
exit 0
