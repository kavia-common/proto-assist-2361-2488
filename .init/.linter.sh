#!/bin/bash
cd /home/kavia/workspace/code-generation/proto-assist-2361-2488/WebFrontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

