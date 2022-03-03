#!/bin/bash

docker run --net=host --rm -ti -v ${PWD}/dumps:/tmp elasticdump/elasticsearch-dump \
  --input=http://admin:changeme@localhost:9200/welcome \
  --output=/tmp/getWelcome.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getWelcome\"}" \
  --overwrite

cp ${PWD}/dumps/getWelcome.json ${PWD}/js

docker run --net=host --rm -ti -v ${PWD}/dumps:/tmp elasticdump/elasticsearch-dump \
  --input=http://admin:changeme@localhost:9200/events \
  --output=/tmp/getNextEvent.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getNextEvent\"}" \
  --size=1 \
  --overwrite

cp ${PWD}/dumps/getNextEvent.json ${PWD}/js

docker run --net=host --rm -ti -v ${PWD}/dumps:/tmp elasticdump/elasticsearch-dump \
  --input=http://admin:changeme@localhost:9200/events \
  --output=/tmp/getEvents.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getEvents\"}" \
  --overwrite
  
cat ${PWD}/dumps/getEvents.json | jq -s > ${PWD}/js/getEvents.json