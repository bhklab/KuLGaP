from flask import Flask, request, send_from_directory
import os
app = Flask(__name__)

# app = Flask(__name__,
#             static_url_path='',
#             static_folder='client/build')

@app.route('/api')
def api():
    return "<h1>API</h1>"


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    path_dir = os.path.abspath("./client/build")  # path react build
    if path != "" and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path)
    else:
        return send_from_directory(os.path.join(path_dir), 'index.html')


if __name__ == '__main__':
    app.run()
