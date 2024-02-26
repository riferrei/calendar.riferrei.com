#!/bin/bash

####################################################################################
###################### Updating the dumps and the JSON files #######################
####################################################################################

docker run --net=host --rm -ti -v ${PWD}/dumps:/tmp elasticdump/elasticsearch-dump \
  --input=http://localhost:9200/welcome \
  --output=/tmp/welcome.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getWelcome\"}" \
  --timeout=1000 \
  --overwrite

cp ${PWD}/dumps/welcome.json ${PWD}/js

docker run --net=host --rm -ti -v ${PWD}/dumps:/tmp elasticdump/elasticsearch-dump \
  --input=http://localhost:9200/events \
  --output=/tmp/events.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getEvents\"}" \
  --timeout=1000 \
  --overwrite
  
cat ${PWD}/dumps/events.json | jq -s > ${PWD}/js/events.json

####################################################################################
######################### Upload the files to the website ##########################
####################################################################################

HOST="calendar.riferrei.com"
USER="riferrei@$HOST"

ftp -p -inv $HOST <<EOF
user $USER
cd /public_html/calendar/js
lcd js
put welcome.json
put events.json
bye
EOF
