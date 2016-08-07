

Installation
============

Install `nodejs`_.

Install `Python`_.

Install virtualenv: ::
  
  pip install virtualenv

Windows: ::

    run install.bat
    run gulp manage type migrate
    run gulp manage type createsuperuser
    run build.bat
    run run.bat

Linux: ::

    bash install.sh
    gulp manage type migrate
    gulp manage type createsuperuser
    gulp build
    gulp serve
  
Notes
=====

Signup not implemented.

.. _nodejs: https://nodejs.org/
.. _Python: https://www.python.org/downloads/release/python-2710/