import os
import sys
from pathlib import Path

from django.core.wsgi import get_wsgi_application

# print("System Path:", sys.path)
print("DJANGO_SETTINGS_MODULE:", os.environ.get("DJANGO_SETTINGS_MODULE"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.serverside.settings")
BASE_DIR = Path(__file__).resolve().parent.parent.parent

application = get_wsgi_application()
# print("BASE_DIR in wsgi:", BASE_DIR)
# print("sys.path:", sys.path)
