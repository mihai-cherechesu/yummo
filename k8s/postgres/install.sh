#!/bin/bash

helm install postgresql-dev --set volumePermissions.enabled=true -f values.yaml bitnami/postgresql
