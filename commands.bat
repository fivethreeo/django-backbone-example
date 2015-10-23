@echo off
setlocal EnableDelayedExpansion

echo Commands:
echo.
echo 1: npm install
echo 2: bower install
echo 3: virtualenv
echo 4: pip install
echo 5: gulp
echo 6: manage.py
echo 7: git checkout-index -a --prefix=..\dir\ (export)
echo.

set /p command="Choose command number:"

if "%command%" EQU "1" goto npm
if "%command%" EQU "2" goto bower
if "%command%" EQU "3" goto virtualenv
if "%command%" EQU "4" goto pip
if "%command%" EQU "5" goto gulp
if "%command%" EQU "6" goto manage
if "%command%" EQU "7" goto checkoutindex

:npm
  set /p args="Arguments:"
  npm install !args!
  goto EOF

:bower
  set /p args="Arguments:"
  bower install !args!
  goto EOF

:virtualenv
  set /p envname="Environment name (default: env):"
  if "!envname!" EQU "" (
    set envname=env
  )
  set /p sitepackages="Use site packages (y/n default: y):"
  if "!sitepackages!" NEQ "n" (
    set sitepackagesargs=--system-site-packages
  )
  set /p args="Arguments:"
  virtualenv !envname! !sitepackagesargs! !args!
  goto EOF

:pip
  set /p envname="Environment name (default: env):"
  if "!envname!" EQU "" (
    set envname=env
  )
  set /p install="pip install? (y/n default: y):"
    set install=install
  )
  set /p userequirements="Use requirements (y/n default: y):"
  if "!userequirements!" NEQ "n" (
    set /p requirements="Requirements file (default: requirements.txt):"
    if "!requirements!" EQU "" (
      set requirements=requirements.txt
    )
    set requirementssargs=-r !requirements!
  )
  set /p args="Arguments:"
  !envname!\Scripts\pip.exe !install! !requirementssargs! !args!
  goto EOF

:gulp
  set /p args="Arguments:"
  gulp !args!
  goto EOF

:manage
  set /p envname="Environment name (default: env):"
  if "!envname!" EQU "" (
    set envname=env
  )
  set /p args="Arguments:"
  !envname!\Scripts\python.exe django/manage.py !args!
  goto EOF

:checkoutindex
  set /p directory="Export to directory (end with slash):"
  if not exist "!directory!\." (
    mkdir !directory!
  )
  git checkout-index -a --prefix=!directory!
  goto EOF