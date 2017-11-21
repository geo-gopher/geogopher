#!/bin/bash

cd /home/ubuntu
chown -R ubuntu:ubuntu ./geogopher

if [[ -d /home/ubuntu/geogopher/credentials ]]; then
   rm -rf /home/ubuntu/geogopher/credentials
fi

exit 0
