#!/bin/bash

# Configuration
INTERVAL=300 # Sync every 5 minutes
LOG_FILE="git_sync.log"

echo "🔄 Starting Umarel Auto-Sync Daemon (Interval: ${INTERVAL}s)..."
echo "Log file: $LOG_FILE"

while true; do
    # Check for changes
    if [[ -n $(git status -s) ]]; then
        TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
        echo "[$TIMESTAMP] Changes detected. Syncing..." >> $LOG_FILE
        
        # Run sync
        ./scripts/git_sync.sh "Auto-sync: $TIMESTAMP" >> $LOG_FILE 2>&1
        
        if [ $? -eq 0 ]; then
            echo "[$TIMESTAMP] ✅ Sync successful." >> $LOG_FILE
        else
            echo "[$TIMESTAMP] ❌ Sync FAILED." >> $LOG_FILE
            # Here we could trigger a system alert if we had a way (e.g. osascript on mac)
            osascript -e 'display notification "Git Sync Failed! Check logs." with title "Umarel Alert" sound name "Basso"'
        fi
    else
         # Heartbeat to log rarely, or just sleep
         :
    fi
    
    # Also Check Remote Connection (Healthcheck)
    git fetch origin main > /dev/null 2>&1
    if [ $? -ne 0 ]; then
         echo "[$(date)] ⚠️ Connection Lost to Remote!" >> $LOG_FILE
         osascript -e 'display notification "Git Disconnected! Fetch failed." with title "Umarel Healthcheck"'
    fi

    sleep $INTERVAL
done
