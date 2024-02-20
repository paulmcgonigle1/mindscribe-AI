import logging

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.debug(f"Incoming request at {request.path}: {request.headers}")
        response = self.get_response(request)
        return response
