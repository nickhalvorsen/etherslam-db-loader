#!/bin/bash

source setup-postgresql-environment.sh
latest=$(node get-latest-block.js)
node load-transaction.js $latest 9000000 
