#!/bin/bash
isExistApp=`pgrep nginx`
if [[ -n  $isExistApp ]]; then
   service nginx stop
fi

isExistApp=`pgrep node`
if [[ -n  $isExistApp ]]; then
   killall node
fi

exit 0
