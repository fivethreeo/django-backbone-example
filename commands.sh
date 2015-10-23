#!/bin/bash

echo "Commands:"
echo
echo "1: npm install"
echo "2: bower install"
echo "3: virtualenv"
echo "4: pip install"
echo "5: gulp"
echo "6: manage.py"
echo "7: git checkout-index -a --prefix=../dir/ (export)"
echo

echo -n "Choose command number:"

read command

case "$command" in
  "1")
    echo -n "Arguments:"
    read commandarguments
    npm install $commandarguments
    ;;
  "2")
    echo -n "Arguments:"
    read commandarguments
    bower install $commandarguments
    ;;
  "3")
    echo -n "Environment name (default: env):"
    read envname
    if [ -z "$envname" ]; then
      envname="env"
    fi
    echo -n "Use site packages (y/n default: y):"
    read sitepackages
    if [ "$sitepackages" != "n" ]; then
      sitepackagesargs=--system-site-packages
    fi
    echo -n "Arguments:"
    read commandarguments
    virtualenv $envname $sitepackagesargs $commandarguments
    ;;
  "4")
    echo -n "Environment name (default: env):"
    read envname
    if [ -z "$envname" ]; then
      envname="env"
    fi
    echo -n "pip install? (y/n default: y):"
    read useinstall
    if [ "$useinstall" != "n" ]; then
      install="install"
    fi
    echo -n "Use requirements (y/n default: y):"
    read userequirements
    if [ "$userequirements" != "n" ]; then
      echo -n "Requirements file (default: requirements.txt):"
      read requirements
      if [ -z "$requirements" ]; then
        requirements="requirements.txt"
      fi
      requirementssargs="-r $requirements"
    fi
    echo -n "Arguments:"
    read commandarguments
    $envname/bin/pip install $install $requirementssargs $commandarguments
    ;;
  "5")
    echo -n "Arguments:"
    read commandarguments
    gulp $commandarguments
    ;;
  "6")
    echo -n "Environment name (default: env):"
    read envname
    if [ -z "$envname" ]; then
      envname="env"
    fi
    echo -n "Arguments:"
    read commandarguments
    $envname/bin/python django/manage.py $commandarguments
    ;;
  "7")
    echo -n "Export to directory (end with backslash):"
    read directory
    if [ ! -d "$directory" ]; then
      md $directory
    fi
    git checkout-index -a --prefix=$directory
    ;;
  *)
    echo "Not available"
    ;;
    
esac