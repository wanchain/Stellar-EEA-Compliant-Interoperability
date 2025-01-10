#!/bin/bash
cd ../

cp ../crossRoute/conf/config.json conf/config.json

sudo docker build -t crossrouteagent:latest .
#sudo docker push crossrouteagent:latest
