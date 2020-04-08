#!/bin/bash

# Initialisation 
old="0"

# Monitoring 
inotifywait -r -m -e modify -e create -e delete --timefmt '%Y-%m-%d %H:%M:%S' --format '%T %w %e' /home/docker/geoportal-access-lib/src/ /home/docker/geoportal-access-lib/samples-src/ |
while read date time file event
do
  message=$date$time$file$event
  if [ $old != $message ]
  then 
    pushd /home/docker/geoportal-access-lib/
    npm run build
    cp -rf ./dist /home/docker/html/geoportal-access-lib/
    cp -rf ./samples /home/docker/html/geoportal-access-lib/
    npm pack
    popd
    old=$message
  fi
done