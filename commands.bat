@echo off
setlocal EnableDelayedExpansion

echo Commands:
echo.
echo 1: gulp build --dev
echo 2: gulp serve --dev
echo 3: gulp build
echo 4: gulp serve
echo 5: npm install
echo 6: bower install
echo 7: virtualenv
echo 8: pip install
echo 9: manage.py
echo 10: git checkout-index -a --prefix=..\dir\ (export)
echo.

set /p command="Choose command number:"

if /I "%command%" EQU "1" (
  gulp build --dev
)
if /I "%command%" EQU "2" (
  gulp serve --dev
)
if /I "%command%" EQU "3" (
  gulp build
)
if /I "%command%" EQU "4" (
  gulp serve
)
if /I "%command%" EQU "5" (
  set /p args="Arguments:"
  npm install !args!
)
if /I "%command%" EQU "6" (
  set /p args="Arguments:"
  bower install !args!
)
if /I "%command%" EQU "7" (
  set /p envname="Environment name (default: env):"
  if /I "!envname!" EQU "" (
    set envname=env
  )
  set /p sitepackages="Use site packages (y/n default: y):"
  if /I "!sitepackages!" NEQ "n" (
    set sitepackagesargs=--system-site-packages
  )
  set /p args="Arguments:"
  virtualenv !envname! !sitepackagesargs! !args!
)
if /I "%command%" EQU "8" (
  set /p envname="Environment name (default: env):"
  if /I "!envname!" EQU "" (
    set envname=env
  )
  set /p install="pip install? (y/n default: y):"
    set install=install
  )
  set /p userequirements="Use requirements (y/n default: y):"
  if /I "!userequirements!" NEQ "n" (
    set /p requirements="Requirements file (default: requirements.txt):"
    if /I "!requirements!" EQU "" (
      set requirements=requirements.txt
    )
    set requirementssargs=-r !requirements!
  )
  set /p args="Arguments:"
  !envname!\Scripts\pip.exe !install! !requirementssargs! !args!
)
if /I "%command%" EQU "9" (
  set /p envname="Environment name (default: env):"
  if /I "!envname!" EQU "" (
    set envname=env
  )
  set /p args="Arguments:"
  !envname!\Scripts\python.exe django/manage.py !args!
)
if /I "%command%" EQU "10" (
set /p directory="Export to directory (end with slash):"
if not exist "!directory!\." (
  mkdir !directory!
)
git checkout-index -a --prefix=!directory!
)