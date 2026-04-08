@echo off
setlocal
node "%~dp0control_plane\local_control_agent\send_command.js" %*
