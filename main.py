from flask import Flask, send_from_directory, request, jsonify, Response
import os
import random
import argparse
import logging
from threading import Lock
from urllib import request as urlrequest
from urllib.error import URLError, HTTPError

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


class LogoRotator:
    """Manages rotation through logo images in a directory."""
    
    def __init__(self, logos_dir):
        """
        Initialize the logo rotator with a directory containing logo images.
        
        Args:
            logos_dir: Path to the directory containing logo images
        """
        self.logos_dir = logos_dir
        self._lock = Lock()
        self._logo_files = []
        self._current_index = 0
        self._load_logos()
    
    def _load_logos(self):
        """Scan the logos directory and load all image files."""
        if not os.path.exists(self.logos_dir):
            return
        
        image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'}
        self._logo_files = [
            f for f in os.listdir(self.logos_dir)
            if os.path.isfile(os.path.join(self.logos_dir, f)) and 
            os.path.splitext(f.lower())[1] in image_extensions
        ]
        self._logo_files.sort()  # Sort for consistent ordering
        self._current_index = 0
    
    def next(self):
        """
        Get the next logo filename in rotation.
        
        Returns:
            str: Filename of the next logo, or None if no logos are available
        """
        if not self._logo_files:
            return None
        
        with self._lock:
            logo_file = self._logo_files[self._current_index]
            self._current_index = (self._current_index + 1) % len(self._logo_files)
            return logo_file
    
    def has_logos(self):
        """Check if any logos are available."""
        return len(self._logo_files) > 0


def _get_env_bool(name, default=False):
    """Parse common boolean env values."""
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _normalize_host(host):
    return host.rstrip("/")


def _normalize_base_path(base_path):
    """Normalize base path so root is empty string and subpaths look like '/shop'."""
    value = (base_path or "").strip()
    if not value or value == "/":
        return ""
    value = value.rstrip("/")
    if not value.startswith("/"):
        value = f"/{value}"
    return value


def init_app(static_folder, base_path=""):
    base_path = _normalize_base_path(base_path)

    # Set a simple static URL path for Flask
    app = Flask(__name__, static_folder=static_folder, static_url_path="/static")
    
    # Initialize logo rotator
    logos_dir = os.path.join(static_folder, "logos")
    logo_rotator = LogoRotator(logos_dir)

    @app.route(f"{base_path}/api/next-logo", methods=['GET'])
    def next_logo():
        if not logo_rotator.has_logos():
            return jsonify({"error": "No logos available!"}), 404
        
        # Get next logo in rotation
        logo_file = logo_rotator.next()
        
        # Return the image file directly
        return send_from_directory(logo_rotator.logos_dir, logo_file)
    # API endpoints
    @app.route(f"{base_path}/api/upload", methods=['POST'])
    def upload_photo():
        file = request.files['photo']
        if file:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            return jsonify({"message": "Photo uploaded successfully!"}), 200
        return jsonify({"error": "No file provided!"}), 400

    @app.route(f"{base_path}/api/random-photo", methods=['GET'])
    def random_photo():
        files = os.listdir(UPLOAD_FOLDER)
        if files:
            random_file = random.choice(files)
            return send_from_directory(UPLOAD_FOLDER, random_file)
        return jsonify({"error": "No photos available!"}), 404

    @app.route(f"{base_path}/api/runtime-config", methods=['GET'])
    def runtime_config():
        analytics_enabled = _get_env_bool("ANALYTICS_ENABLED", default=False)
        proxy_base = f"{base_path}/api/u" if base_path else "/api/u"

        return jsonify({
            "analytics": {
                "enabled": analytics_enabled,
                "host": os.getenv("ANALYTICS_HOST", "").strip(),
                "siteId": os.getenv("ANALYTICS_SITE_ID", "").strip(),
                "proxyEnabled": _get_env_bool("ANALYTICS_PROXY_ENABLED", default=True),
                "proxyBase": proxy_base,
            }
        })

    @app.route(f"{base_path}/api/analytics/script.js", methods=['GET'])
    @app.route(f"{base_path}/api/u/script.js", methods=['GET'])
    def analytics_script_proxy():
        host = _normalize_host(os.getenv("ANALYTICS_HOST", "").strip())
        if not host:
            return jsonify({"error": "ANALYTICS_HOST is not configured"}), 404

        try:
            upstream_url = f"{host}/script.js"
            req = urlrequest.Request(upstream_url, headers={"User-Agent": "ju-shop/analytics-proxy"})
            with urlrequest.urlopen(req, timeout=10) as upstream:
                body = upstream.read()
                content_type = upstream.headers.get("Content-Type", "application/javascript")
                cache_control = upstream.headers.get("Cache-Control")
                response = Response(body, status=upstream.status, content_type=content_type)
                if cache_control:
                    response.headers["Cache-Control"] = cache_control
                return response
        except HTTPError as error:
            return jsonify({"error": "Failed to fetch analytics script", "status": error.code}), 502
        except URLError:
            return jsonify({"error": "Unable to reach analytics host"}), 502

    @app.route(f"{base_path}/api/analytics/api/send", methods=['POST'])
    @app.route(f"{base_path}/api/u/api/send", methods=['POST'])
    def analytics_send_proxy():
        host = _normalize_host(os.getenv("ANALYTICS_HOST", "").strip())
        if not host:
            return jsonify({"error": "ANALYTICS_HOST is not configured"}), 404

        try:
            upstream_url = f"{host}/api/send"
            headers = {
                "Content-Type": request.headers.get("Content-Type", "application/json"),
                "User-Agent": "ju-shop/analytics-proxy",
            }
            x_umami_cache = request.headers.get("x-umami-cache")
            if x_umami_cache:
                headers["x-umami-cache"] = x_umami_cache

            req = urlrequest.Request(
                upstream_url,
                data=request.get_data(cache=True),
                headers=headers,
                method="POST",
            )

            with urlrequest.urlopen(req, timeout=10) as upstream:
                body = upstream.read()
                content_type = upstream.headers.get("Content-Type", "application/json")
                return Response(body, status=upstream.status, content_type=content_type)
        except HTTPError as error:
            return jsonify({"error": "Analytics upstream rejected payload", "status": error.code}), 502
        except URLError:
            return jsonify({"error": "Unable to reach analytics host"}), 502

    # Serve React frontend
    @app.route(f"{base_path}/<path:path>")
    def serve_frontend(path=""):
        try:
            return send_from_directory(app.static_folder, path)
        except:
            return send_from_directory(app.static_folder, "index.html")

    # Default route
    @app.route(f"{base_path}/")
    def index():
        return send_from_directory(app.static_folder, "index.html")

    return app

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Ju Shop backend and web server')
    parser.add_argument('-d', '--debug', action='store_true', help='Run the application in debug mode')
    parser.add_argument('-f', '--frontend', type=str, required=True, help='Path to the frontend build directory')
    parser.add_argument('-b', '--base-path', type=str, default="", help='Base path for the app (e.g., /shop)')
    args = parser.parse_args()

    # Normalize base path
    base_path = _normalize_base_path(args.base_path)

    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    # Initialize app with dynamic base path
    logger.info(f"Initializing app with base path: {base_path}")
    app = init_app(args.frontend, base_path=base_path)

    # Run the Flask app
    app.run(host="0.0.0.0", port=80, debug=args.debug)
