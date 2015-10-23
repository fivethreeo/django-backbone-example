#!/bin/bash

echo "Commands:"
echo
echo "1: gulp build --dev"
echo "2: gulp serve --dev"
echo "3: gulp build"
echo "4: gulp serve"
echo "5: npm install"
echo "6: bower install"
echo "7: virtualenv"
echo "8: pip install"
echo "9: manage.py"
echo "10: git checkout-index -a --prefix=../dir/ (export)"
echo

echo -n "Choose command number:"

read command

case "$command" in
  "1")
    gulp build --dev
    ;;
  "2")
    gulp serve --dev
    ;;
  "3")
    gulp build
    ;;
  "4")
    gulp serve
    ;;
  "5")
    echo -n "Arguments:"
    read commandarguments
    npm install $commandarguments
    ;;
  "6")
    echo -n "Arguments:"
    read commandarguments
    bower install $commandarguments
    ;;
  "7")
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
  "8")
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
  "9")
    echo -n "Environment name (default: env):"
    read envname
    if [ -z "$envname" ]; then
      envname="env"
    fi
    echo -n "Arguments:"
    read commandarguments
    $envname/bin/python django/manage.py $commandarguments
    ;;
  "10")
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