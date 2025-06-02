#!/bin/bash

# MindScribe AI Development Startup Script
echo "🚀 Starting MindScribe AI Development Environment..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "🔍 Checking dependencies..."

if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is required but not installed."
    exit 1
fi

echo "✅ All dependencies found!"

# Start FastAPI backend
echo "🔥 Starting FastAPI backend..."
cd backend_fastapi
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "🔧 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "🌐 Starting FastAPI server on http://localhost:8000..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start React frontend
echo "⚛️  Starting React frontend..."
cd ../clientside

echo "📦 Installing Node.js dependencies..."
npm install

echo "🌐 Starting Vite dev server on http://localhost:5173..."
npm run dev &
FRONTEND_PID=$!

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped!"
    exit 0
}

# Set up cleanup trap
trap cleanup SIGINT SIGTERM

echo ""
echo "🎉 MindScribe AI Development Environment Started!"
echo "📊 Backend API: http://localhost:8000"
echo "🌐 Frontend: http://localhost:5173"
echo "📚 API Docs: http://localhost:8000/api/v1/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID