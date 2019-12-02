#!/usr/bin/env bash

cd build && git init && git add . && git commit -m 'publish' && git remote add origin https://github.com/YSMJ1994/ysmj1994.github.io.git && git push -f origin master

