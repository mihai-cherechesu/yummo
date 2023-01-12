#!/bin/sh

docker build . -t paravirtualtishu/yummo-socket:latest && \
docker push paravirtualtishu/yummo-socket:latest
