@echo off

:: Parking Lot Simulator - Setup Script
::
:: Installs dependencies for the React application.
::
:: @version 0.2.0

echo Installing dependencies for Parking Lot Simulator...
npm install

:: Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

echo Setup complete! Run 'npm run dev' to start the React app.
echo To run the Python script, use 'python python/memory_allocation.py'.
