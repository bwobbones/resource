#!/bin/sh

set -e

PATH=/usr/sbin:/usr/bin:/sbin:/bin

echo "Stopping Resource"
stop resource

echo "Backing up the database..."
stop tokumx
rdiff-backup /var/lib/tokumx /mnt/nas01/tokumx
start tokumx

echo "Backing up the indexes..."
curl -XPUT "localhost:9200/_snapshot/my_backup/snapshot_$(date +%Y_%m_%d_%H_%M_%S)?wait_for_completion=true" -d '{ "indices": "personnel" }'

echo "Bouncing ElasticSearch"
service elasticsearch restart

echo "Restarting Resource"
start resource

date +'%d/%m/%Y %H:%M:%S' 
echo "BACKUP SUCCESS"