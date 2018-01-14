#!/bin/bash

latest=$(node get-latest-block.js)
node load-transaction.js $latest 9000000 
