#!/bin/bash

# IB Project Management Script
# Usage: ./manage.sh {start|run|stop|status|log} {b|f|m|a} (default target is 'a')

IB_HOME="/home/kbgkim/antigravity/projects/ib"

# Configuration
BACKEND_PORT=8080
FRONTEND_PORT=3000
ML_PORT=8000
PF_PORT=8082

BACKEND_DIR="$IB_HOME"
FRONTEND_DIR="$IB_HOME/ib-ui-web"
ML_DIR="$IB_HOME/ib-ml-engine"
PF_DIR="$IB_HOME/ib-pf-engine"

LOG_DIR="$IB_HOME/logs"
mkdir -p "$LOG_DIR"

BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
ML_LOG="$LOG_DIR/ml.log"
PF_LOG="$LOG_DIR/pf.log"

get_pid_by_port() {
    local port=$1
    local pid=$(lsof -t -i :$port 2>/dev/null | tail -n 1)
    echo "$pid"
}

manage_backend() {
    local cmd=$1
    case "$cmd" in
        start)
            echo "Starting Backend (Spring Boot) in background..."
            cd "$BACKEND_DIR"
            nohup ./gradlew :ib-mna-engine:bootRun > "$BACKEND_LOG" 2>&1 &
            sleep 5
            PID=$(get_pid_by_port $BACKEND_PORT)
            if [ -n "$PID" ]; then
                echo "Backend started (PID: $PID). Logs: $BACKEND_LOG"
            else
                echo "Starting Backend... check logs: $BACKEND_LOG"
            fi
            ;;
        stop)
            echo "Stopping Backend..."
            PID=$(get_pid_by_port $BACKEND_PORT)
            if [ -n "$PID" ]; then
                kill -9 $PID
                echo "Backend (PID: $PID) stopped."
            else
                echo "Backend is not running (Port $BACKEND_PORT free)."
            fi
            ;;
        status)
            PID=$(get_pid_by_port $BACKEND_PORT)
            [ -n "$PID" ] && echo "Backend : RUNNING (PID: $PID)" || echo "Backend : STOPPED"
            ;;
    esac
}

manage_frontend() {
    local cmd=$1
    case "$cmd" in
        start)
            echo "Starting Frontend (Vite/React) in background..."
            cd "$FRONTEND_DIR"
            nohup npm run dev -- --port $FRONTEND_PORT > "$FRONTEND_LOG" 2>&1 &
            sleep 3
            PID=$(get_pid_by_port $FRONTEND_PORT)
            if [ -n "$PID" ]; then
                echo "Frontend started (PID: $PID). Logs: $FRONTEND_LOG"
            else
                echo "Starting Frontend... check logs: $FRONTEND_LOG"
            fi
            ;;
        stop)
            echo "Stopping Frontend..."
            PID=$(get_pid_by_port $FRONTEND_PORT)
            if [ -n "$PID" ]; then
                kill -9 $PID
                echo "Frontend (PID: $PID) stopped."
            else
                echo "Frontend is not running (Port $FRONTEND_PORT free)."
            fi
            ;;
        status)
            PID=$(get_pid_by_port $FRONTEND_PORT)
            [ -n "$PID" ] && echo "Frontend: RUNNING (PID: $PID)" || echo "Frontend: STOPPED"
            ;;
    esac
}

manage_ml() {
    action=$1
    case $action in
        start)
            echo "Starting ML Engine (FastAPI) in background..."
            pid=$(get_pid_by_port $ML_PORT)
            if [ -n "$pid" ]; then
                echo "ML Engine is already running (PID: $pid). Stop it first."
                return
            fi
            cd "$ML_DIR"
            if [ -d "venv" ]; then
                nohup ./venv/bin/python3 -m uvicorn app.main:app --host 0.0.0.0 --port $ML_PORT > "$ML_LOG" 2>&1 &
                new_pid=$!
                echo "ML Engine started (PID: $new_pid). Logs: $ML_LOG"
            else
                echo "Error: Virtual environment (venv) not found in $ML_DIR"
            fi
            ;;
        stop)
            echo "Stopping ML Engine..."
            pid=$(get_pid_by_port $ML_PORT)
            if [ -n "$pid" ]; then
                kill $pid
                echo "ML Engine (PID: $pid) stopped."
            else
                echo "ML Engine is not running (Port $ML_PORT free)."
            fi
            ;;
        status)
            pid=$(get_pid_by_port $ML_PORT)
            if [ -n "$pid" ]; then
                echo "ML Engine: RUNNING (PID: $pid)"
            else
                echo "ML Engine: STOPPED"
            fi
            ;;
    esac
}

manage_pf() {
    local cmd=$1
    case "$cmd" in
        start)
            echo "Starting PF Engine (Spring Boot) in background..."
            cd "$IB_HOME"
            nohup ./gradlew :ib-pf-engine:bootRun > "$PF_LOG" 2>&1 &
            sleep 5
            PID=$(get_pid_by_port $PF_PORT)
            if [ -n "$PID" ]; then
                echo "PF Engine started (PID: $PID). Logs: $PF_LOG"
            else
                echo "Starting PF Engine... check logs: $PF_LOG"
            fi
            ;;
        stop)
            echo "Stopping PF Engine..."
            PID=$(get_pid_by_port $PF_PORT)
            if [ -n "$PID" ]; then
                kill -9 $PID
                echo "PF Engine (PID: $PID) stopped."
            else
                echo "PF Engine is not running (Port $PF_PORT free)."
            fi
            ;;
        status)
            PID=$(get_pid_by_port $PF_PORT)
            [ -n "$PID" ] && echo "PF Engine: RUNNING (PID: $PID)" || echo "PF Engine: STOPPED"
            ;;
    esac
}

case $1 in
    run|start)
        target=${2:-a}
        case $target in
            b|backend) manage_backend start ;;
            f|frontend) manage_frontend start ;;
            m|ml) manage_ml start ;;
            p|pf) manage_pf start ;;
            a|all)
                manage_ml start
                echo "--------------------------------------"
                manage_pf start
                echo "--------------------------------------"
                manage_backend start
                echo "--------------------------------------"
                manage_frontend start
                ;;
            *) echo "Usage: $0 run [b|f|m|a]" ;;
        esac
        ;;
    stop)
        target=${2:-a}
        case $target in
            b|backend) manage_backend stop ;;
            f|frontend) manage_frontend stop ;;
            m|ml) manage_ml stop ;;
            p|pf) manage_pf stop ;;
            a|all)
                manage_frontend stop
                echo "--------------------------------------"
                manage_backend stop
                echo "--------------------------------------"
                manage_pf stop
                echo "--------------------------------------"
                manage_ml stop
                ;;
            *) echo "Usage: $0 stop [b|f|m|a]" ;;
        esac
        ;;
    status)
        target=${2:-a}
        case $target in
            b|backend) manage_backend status ;;
            f|frontend) manage_frontend status ;;
            m|ml) manage_ml status ;;
            p|pf) manage_pf status ;;
            a|all)
                manage_backend status
                echo "--------------------------------------"
                manage_frontend status
                echo "--------------------------------------"
                manage_ml status
                echo "--------------------------------------"
                manage_pf status
                ;;
        esac
        ;;
    log)
        target=${2:-a}
        case $target in
            b|backend) tail -f "$BACKEND_LOG" ;;
            f|frontend) tail -f "$FRONTEND_LOG" ;;
            m|ml) tail -f "$ML_LOG" ;;
            p|pf) tail -f "$PF_LOG" ;;
            a|all) tail -f "$BACKEND_LOG" "$FRONTEND_LOG" "$ML_LOG" "$PF_LOG" ;;
        esac
        ;;
    *)
        echo "Usage: $0 {run|stop|status|log} [b|f|m|a]"
        exit 1
        ;;
esac
