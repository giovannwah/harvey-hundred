from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////./harvey-hundreds.db'
db = SQLAlchemy(app)

@app.route("/get-scores")
def getScores():
    return "Welcome to F5 mother F-er"

@app.route("/last-score")
def getLastScore():
    return ""

if __name__ == "__main__":
    app.run()




