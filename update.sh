#!/bin/bash

docker run --net=host --rm -ti -v /tmp:/tmp elasticdump/elasticsearch-dump \
  --input=http://admin:changeme@localhost:9200/welcome \
  --output=/tmp/getWelcome.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getWelcome\"}" \
  --overwrite

cp /tmp/getWelcome.json ${PWD}/js

docker run --net=host --rm -ti -v /tmp:/tmp elasticdump/elasticsearch-dump \
  --input=http://admin:changeme@localhost:9200/events \
  --output=/tmp/getNextEvent.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getNextEvent\"}" \
  --overwrite

cat /tmp/getNextEvent.json | jq -s > ${PWD}/js/getNextEvent.json

docker run --net=host --rm -ti -v /tmp:/tmp elasticdump/elasticsearch-dump \
  --input=http://admin:changeme@localhost:9200/events \
  --output=/tmp/getEvents.json \
  --type=data \
  --searchWithTemplate \
  --searchBody="{\"id\":\"getEvents\"}" \
  --overwrite
  
cat /tmp/getEvents.json | jq -s > ${PWD}/js/getEvents.json