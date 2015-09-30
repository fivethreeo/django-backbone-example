#!/usr/bin/env python

import os
from django.utils._os import upath
import app_manage
from app_manage.config import DEFAULT_SETTINGS

MEDIA_ROOT=os.path.join(os.path.dirname(upath(__file__)), "media")
STATICFILES_DIRS=[
  os.path.join(os.path.dirname(upath(__file__)), "../app"),
  os.path.join(os.path.dirname(upath(__file__)), "../bower_components")
]
TEMPLATE_DIRS=[
  os.path.join(os.path.dirname(upath(__file__)), "../app")
]
MIDDLEWARE_CLASSES=list(DEFAULT_SETTINGS['MIDDLEWARE_CLASSES'])+['livereload.middleware.LiveReloadScript']

if __name__ == '__main__':
    app_manage.main(
        [
            'better_test',
            'django.contrib.contenttypes',
            'django.contrib.auth',
            'django.contrib.sessions',
            'django.contrib.admin',
            'django.contrib.admindocs',
            'django.contrib.sites',
            'django.contrib.staticfiles'
        ],
        DEBUG=True,
        SITE_ID=1,
        DATABASES=app_manage.DatabaseConfig(
            default='sqlite:///baseapp.sqlite'
        ),
        STATICFILES_DIRS=STATICFILES_DIRS,
        TEMPLATE_DIRS=TEMPLATE_DIRS,
        MIDDLEWARE_CLASSES=MIDDLEWARE_CLASSES,
        ROOT_URLCONF='app.urls',
        STATIC_ROOT=app_manage.TempDir(),
        MEDIA_ROOT=os.path.join(os.path.dirname(upath(__file__)), "../media"),
        MEDIA_URL = "/media/",
        THUMBNAIL_DEBUG = True

    )
