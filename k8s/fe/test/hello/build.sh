#!/bin/sh

npm  run-script build && \
docker build . -t paravirtualtishu/nginx-fe:latest && \
docker push paravirtualtishu/nginx-fe:latest