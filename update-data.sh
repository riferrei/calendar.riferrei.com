#!/bin/bash

####################################################################################
###################### Updating the dumps and the JSON files #######################
####################################################################################

docker run --net=host --rm -ti -v ${PWD}/dumps:/tmp elasticdump/elasticsearch-dump \
  --input=http://admin:changeme@localhost:9200/welcome \
  --output=/tmp/getWelcome.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getWelcome\"}" \
  --timeout=1000 \
  --overwrite

cp ${PWD}/dumps/getWelcome.json ${PWD}/js

docker run --net=host --rm -ti -v ${PWD}/dumps:/tmp elasticdump/elasticsearch-dump \
  --input=http://admin:changeme@localhost:9200/events \
  --output=/tmp/getNextEvent.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getNextEvent\"}" \
  --timeout=1000 \
  --size=1 \
  --overwrite

cp ${PWD}/dumps/getNextEvent.json ${PWD}/js

docker run --net=host --rm -ti -v ${PWD}/dumps:/tmp elasticdump/elasticsearch-dump \
  --input=http://admin:changeme@localhost:9200/events \
  --output=/tmp/getEvents.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getEvents\"}" \
  --timeout=1000 \
  --overwrite
  
cat ${PWD}/dumps/getEvents.json | jq -s > ${PWD}/js/getEvents.json

####################################################################################
######################### Upload the files to the website ##########################
####################################################################################

HOST="calendar.riferrei.com"
USER="riferrei"

ftp -p -inv $HOST <<EOF
user $USER
cd /public_html/calendar/js
lcd js
put getWelcome.json
put getNextEvent.json
put getEvents.json
bye
EOF
