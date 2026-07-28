from flask import Flask, send_file

app = Flask(__name__)

@app.route("/")
def index():
    return send_file("index.html")

@app.route("/style.css")
def style():
    return send_file("style.css")

@app.route("/game.js")
def js():
    return send_file("game.js")

if __name__ == "__main__":
    app.run(debug=True)
