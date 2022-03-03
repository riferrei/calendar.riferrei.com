#!/bin/bash

####################################################################################
######################### Upload the files to the website ##########################
####################################################################################

HOST="calendar.riferrei.com"
USER="riferrei"

ftp -p -inv $HOST <<EOF
user $USER
cd /public_html/calendar/images
lcd images
binary
mput *.*
bye
EOF
