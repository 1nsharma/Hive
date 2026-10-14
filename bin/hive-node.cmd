@echo off
if not exist "C:\Program Files\nodejs\node.exe" goto electron
"C:\Program Files\nodejs\node.exe" %*
goto :eof
:electron
set ELECTRON_RUN_AS_NODE=1
"C:\Users\18\AppData\Local\Programs\Munder Difflin\Munder Difflin.exe" %*
