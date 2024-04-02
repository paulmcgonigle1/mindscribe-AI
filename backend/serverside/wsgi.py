import os
import sys

from django.core.wsgi import get_wsgi_application

# print("System Path:", sys.path)
print("DJANGO_SETTINGS_MODULE:", os.environ.get("DJANGO_SETTINGS_MODULE"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "serverside.settings")

application = get_wsgi_application()
