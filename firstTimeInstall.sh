#!/bin/bash

# NOTE: Only tested on MacOS

echo "--- Setting up Frontend ---"
cd Frontend
npm install
echo "--- Frontend Ready ---"

echo "--- Setting up Backend ---"
cd ../Backend
npm install

# 2. Python Setup: Check for Virtual Environment (venv)
# If the folder 'venv' doesn't exist, create it using python3
if [ ! -d "venv" ]; then
    echo "--- 📦 Creating Python Virtual Environment... ---"
    python3 -m venv venv
fi

# 3. Activate the virtual environment
# This allows us to use 'pip' and 'python' inside this block safely
source venv/bin/activate

# 4. Install requirements INSIDE the virtual environment
echo "--- Installing Python Dependencies... ---"
pip install -r requirements.txt

echo "--- Backend Ready ---"

# Navigate back to root
cd ..
