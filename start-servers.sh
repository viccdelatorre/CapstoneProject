#!/bin/bash

#kill any process sitting on a specific port
kill_port() {
    PORT=$1
    #find PID using lsof, suppress errors if empty
    PID=$(lsof -ti:$PORT 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "--- Cleaning port $PORT (PID: $PID) ---"
        kill -9 $PID
    fi
}

#kills django
cleanup() {
    echo "--- Shutting down servers... ---"
    kill $(jobs -p) 2>/dev/null
}
trap cleanup EXIT

echo "--- Checking ports... ---"
kill_port 8000

echo "--- Starting Servers ---"

# 2. Start Backend
# We run this in a subshell so we can activate venv without affecting the main script
(cd Backend && source venv/bin/activate && python manage.py runserver) &

# 3. Start Frontend
(cd Frontend && npm run dev)

# 4. Wait keeps the script running
wait