#!/bin/bash
cd /home/kavia/workspace/code-generation/email-suite-489/gmail_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

