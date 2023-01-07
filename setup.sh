#!/bin/bash

# Pre-requisites for running this script:
# docker compose: v2
# docker engine: 19.03.0+
# gitlab-runner: 11.2.0

if [[ "$1" == "start" ]]
then
    sudo chown -R 472:472 ./grafana
    docker swarm init
    sleep 1
    docker-compose build
    sleep 1
    docker-compose push
    sleep 1
    docker service create --no-resolve-image --name registry --publish published=5000,target=5000 registry:2
    sleep 1
    docker stack deploy --compose-file docker-compose.yml yummo-stack
    sleep 5
    cd grafana/
    curl -d "@email_alert_notifier.json" -H "Content-Type: application/json" -X POST http://admin:admin@localhost:30000/api/alert-notifications
    cd ..

elif [[ "$1" == "stop" ]]
then
    docker stack rm yummo-stack
    sleep 1
    docker service rm registry
    sleep 1
    docker swarm leave --force
    sleep 1
    docker rmi yummo-fe yummo-nginx yummo-grafana yummo-mail-service

    rm -rf `pwd`/srv

elif [[ "$1" == "register-gitlab" ]]
then
    mkdir -p `pwd`/srv/gitlab-runner/config
    docker run --rm -it -v `pwd`/srv/gitlab-runner/config:/etc/gitlab-runner gitlab/gitlab-runner register \
        --non-interactive \
        --url "https://gitlab.cs.pub.ro/" \
        --registration-token "GR1348941EE4wfnx2-y32ALrHHWny" \
        --executor "docker" \
        --docker-image docker:19.03 \
        --description "cloud-runner" \
        --run-untagged="true" \
        --locked="false" \
        --access-level="not_protected"

    sleep 2
    sudo chmod a+rw `pwd`/srv/gitlab-runner/config/config.toml
    sed -i 's#privileged =.*#privileged = true#' \
        `pwd`/srv/gitlab-runner/config/config.toml
    sed -i 's#volumes =.*#volumes = \["/cache", "/var/run/docker.sock:/var/run/docker.sock"\]#' \
        `pwd`/srv/gitlab-runner/config/config.toml
else
    echo "Unsupported command."
fi
