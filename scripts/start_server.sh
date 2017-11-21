#!/bin/bash

service nginx start

cd /home/ubuntu/geogopher
npm install
npm run build
chown ubuntu:ubuntu /home/ubuntu/geogopher/dist/bundle.*
npm start > /dev/null 2> /dev/null < /dev/null &

