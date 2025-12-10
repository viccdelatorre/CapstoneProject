#!/bin/bash

# NOTE: Only tested on MacOS
# Use this script to start servers if dependencies are already installed

echo "--- ⚡ Starting Servers ---"

# Start Backend (Django) in the background
(cd Backend && source venv/bin/activate && python manage.py runserver) &

# Start Frontend (Vite)
(cd Frontend && npm run dev)

# Wait prevents the script from closing immediately so you can see logs
wait