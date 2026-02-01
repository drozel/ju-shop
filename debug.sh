#!/bin/bash

trap 'kill %1; kill %2' SIGINT

python main.py & 
cd frontend && npm run start &

wait