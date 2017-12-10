#!/bin/bash
latest=$(PGUSER=etherslam PGPASSWORD=icedtea PGHOST=localhost PGDATABASE=etherslam node get-latest-block.js)
PGUSER=etherslam PGPASSWORD=icedtea PGHOST=localhost PGDATABASE=etherslam node load-transaction.js $latest 9000000 
