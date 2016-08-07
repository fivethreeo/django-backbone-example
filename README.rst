

Installation
============

Install `nodejs`_ or `io.js`_.

Install `Python`_.

Install virtualenv: ::
  
  pip install virtualenv

Install node modules: ::

  npm install
  npm install -g bower

Install bower assets: ::

  bower install

Create virtualenv: ::

  virtualenv env

Install python modules: ::

  env/bin/pip install -r requirements.txt

Sync django database: ::

  env/bin/python django/manage.py syncdb

Pasteable commands (linux): ::

  npm install
  npm install -g bower
  bower install
  gulp less 

  pip install virtualenv

  virtualenv env
  env/bin/pip install -r requirements.txt
  env/bin/python django/manage.py syncdb
  env/bin/python django/manage.py runserver

Pasteable commands (win): ::

  npm install
  npm install -g bower
  bower install
  gulp less
  
  pip install virtualenv

  virtualenv env
  env\Scripts\pip.exe install -r requirements.txt
  env\Scripts\python.exe django\manage.py syncdb
  env\Scripts\python.exe django\manage.py runserver
  
Notes
=====

Signup not implemented.

.. _nodejs: https://nodejs.org/
.. _io.js: https://iojs.org/
.. _Python: https://www.python.org/downloads/release/python-2710/