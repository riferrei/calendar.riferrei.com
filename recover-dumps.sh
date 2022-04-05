#!/bin/bash

docker run --net=host --rm -ti -v ${PWD}/dumps:/tmp elasticdump/elasticsearch-dump \
  --input=/tmp/events.json \
  --output=http://admin:changeme@localhost:9200/events \
  --type=data \
  --timeout=1000 \
  --overwrite
