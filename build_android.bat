@echo off
set JAVA_HOME=d:\Projects\WaterCow\jdk-17\jdk-17.0.12+7
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=D:\Apps\platform-tools-latest-windows\platform-tools
cd /d d:\Projects\WaterCow\android
.\gradlew.bat assembleDebug --stacktrace 2>&1 | findstr /i "error exception caused failure"
