#!/bin/bash

HOST="calendar.riferrei.com"
USER="riferrei"

ftp -p -inv $HOST <<EOF
user $USER
cd /public_html/calendar/js
lcd js
put welcome.json
put events.json
bye
EOF