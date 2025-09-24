@echo off
echo Syncing WB-SM project to GitHub...
echo.

echo Adding all changes...
git add .

echo Committing changes...
git commit -m "Auto-sync: %date% %time%"

echo Pushing to GitHub...
git push origin main

echo.
echo Sync completed successfully!
echo Repository: https://github.com/ahmshafiqulalamsiddique-ui/WB-SM
pause
