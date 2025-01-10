#！/bin/sh

function use() {
  echo "================================================"
  echo "USAGE:"
  echo "./start_agent.sh.sh [agentaddr] [hostip] [index] [password] [keystore]"
  echo " e.g.: $0 172.17.0.1"
  echo "================================================"
}

if [[ $# -gt 9 ]] || [[ $# -eq 0 ]]; then
  use
  exit
fi

echo $@

agentaddr=$1

echo "================================================"
echo "agent-"$agentaddr
echo "Start as a crossRoute agent"
echo "================================================"

index=$3

# loglevel, debug as default
loglevel='debug'

# stormanAgent docker image
image='crossrouteagent:latest'
echo '*********** use docker image ***********:  '$image

# container name
container="crossRoute_"$index
echo '*********** use container name ***********:  '$container

#db config. dbip should be host docker IP
# INT="docker0"
# dbip=$(ifconfig $INT | grep "inet" | grep -v inet6 | awk '{ print $2}')
dbip=$2
#dbip='172.17.0.1'
dbport=27017
echo '*********** use db config ***********:  '$dbip":"$dbport

password=$4
keystore=$5

if [[ $index -eq 1 ]];then
  echo "index 1 should be leader, index is $index, agentaddr is $agentaddr"
  agentPm2Json='
  {
    "apps" : [{
      "name"       : "crossRouteAgent",
      "script"      : "agent-linux",
      "cwd"         : "bin",
      "args"        : "-i '$index' --loglevel '$loglevel' --leader --testnet --agentaddr '$agentaddr' --password /agent/pwd.json --keystore /agent/keystore/ --dbip '$dbip' --dbport '$dbport'",
      "log_date_format"  : "YYYY-MM-DD HH:mm Z",
      "env": {}
    }]
  }
  '
else
  agentPm2Json='
  {
    "apps" : [{
      "name"       : "crossRouteAgent",
      "script"      : "agent-linux",
      "cwd"         : "bin",
      "args"        : "-i '$index' --loglevel '$loglevel' --testnet --agentaddr '$agentaddr' --password /agent/pwd.json --keystore /agent/keystore/ --dbip '$dbip' --dbport '$dbport'",
      "log_date_format"  : "YYYY-MM-DD HH:mm Z",
      "env": {}
    }]
  }
  '
fi

CRTDIR=$(pwd)
pm2ScriptPath="$HOME/deploy/agents/agent$index"
echo $agentPm2Json > $pm2ScriptPath/agent_pm2.json

sudo docker rm -f $container

cmd="sudo docker run --log-opt max-size=200m --log-opt max-file=3 \
--name $container \
-v $password:/agent/pwd.json \
-v $keystore:/agent/keystore \
-v $pm2ScriptPath/agent_pm2.json:/agent/agent_pm2.json \
-d --restart=always $image
"

echo $cmd

#exec $cmd

sudo docker run --log-opt max-size=200m --log-opt max-file=3 \
--name $container \
-v $password:/agent/pwd.json \
-v $keystore:/agent/keystore \
-v $pm2ScriptPath/agent_pm2.json:/agent/agent_pm2.json \
-d --restart=always $image

