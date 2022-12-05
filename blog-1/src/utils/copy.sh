#!/bin/sh
 cd /Users/72cy-0101-01-0017/Desktop/github/nodejs-webserver/blog-1/logs
 cp access.log $(date +%Y-%m-%d).access.log
 echo "" > access.log