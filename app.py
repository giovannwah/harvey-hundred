from flask import Flask, Response, jsonify, request, abort
from werkzeug.datastructures import Headers
from flask_sqlalchemy import SQLAlchemy
import functools

#freegeoip.net for free geoip stuff

MAX_STORED_SCORES = 25
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///harvey-hundreds.db'
app.debug = True
db = SQLAlchemy(app)

@app.route("/get-scores", methods=['GET'])
def getScores():
    '''
    Get all scores
    ''' 
    scores = HighScores.query.all()
    if len(scores) > 0:
        scores.sort(reverse=True)
    else:
        return jsonify([])
    ret = [{'rank': x.rank,
            'game_matches': x.game_matches,
            'game_time': x.game_time,
            'game_efficiency': x.game_efficiency,
            'user': x.user,
            'date': x.date,
            'location': x.location} for x in scores]
    return jsonify(ret)

@app.route("/last-score", methods=['GET'])
def getLastScore():
    '''
    Get the score with the lowest rank in the database.
    '''
    x = HighScores.getLast()
    if not x is None: 
        return jsonify({'rank': x.rank,
                'game_matches': x.game_matches,
                'game_time': x.game_time,
                'game_efficiency': x.game_efficiency,
                'user': x.user,
                'date': x.date,
                'location': x.location})
    else: 
        return jsonify({})

@app.route("/first-score", methods=['GET'])
def getFirstScore():
    '''
    Get the score with the highest rank in the database.
    '''
    x = HighScores.getFirst()
    if not x is None: 
        return jsonify({'rank': x.rank,
                'game_matches': x.game_matches,
                'game_time': x.game_time,
                'game_efficiency': x.game_efficiency,
                'user': x.user,
                'date': x.date,
                'location': x.location})
    else: 
        return jsonify({})

@app.route("/add-score", methods=['POST'])
def addScore():
    '''
    Get new score, add to current list of scores, sort by rank, then remove extra items
    '''
    try:
        scores = HighScores.query.all()
        # add new score and sort scores based in ordering
        data = request.get_json(force=True)
        new_score = HighScores(rank=int(data['rank']), game_matches=int(data['game_matches']), game_time=float(data['game_time']),
                               game_efficiency=float(data['game_efficiency']), user=str(data['user']), date=str(data['date']), 
                               location=str(data['location']))
        if len(scores) == 0:
            new_score.rank = 1
            db.session.add(new_score)
            db.session.commit()
        else:    
            db.session.add(new_score)
            scores = HighScores.query.all()
            scores.sort(reverse=True)
            # assign new ranks after sorting scores
            for x in range(1, len(scores)+1):
                scores[x-1].rank = x
            # Truncate extra scores
            if len(scores) > MAX_STORED_SCORES:
                for score in scores:
                    if score.rank > MAX_STORED_SCORES:
                        db.session.delete(score)
           
            db.session.commit()
            
    except Exception as e:
        print(f'An unexpected error occured: {e}')
        abort(500)        
    else: 
        h = Headers()
        h.add('Content-Type', 'application/json')
        return Response(mimetype='application/json', response='{"message":"OK","status":"200"}', status='OK', headers=h)
        
@functools.total_ordering
class HighScores(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    rank = db.Column(db.Integer, nullable = False)
    game_matches = db.Column(db.Integer, nullable = False)
    game_time = db.Column(db.Float, nullable = False)
    game_efficiency = db.Column(db.Float, nullable = False)
    user = db.Column(db.String, nullable = False)
    date = db.Column(db.String, nullable = False)
    location = db.Column(db.String, nullable = False)
    
    def __repr__(self):
        return f'<rank: {self.rank}; score: {self.game_matches*100}; time: {self.game_time}; efficiency: {self.game_efficiency}; user: {self.user}>'
    
    def __eq__(self, other):
        return self.game_matches == other.game_matches and self.game_time == other.game_time and self.game_efficiency == other.game_efficiency
    
    def __lt__(self, other):
        if self.game_matches < other.game_matches:
            return True
        elif self.game_matches == other.game_matches:
            if self.game_time > other.game_time:
                return True
            elif self.game_time == other.game_time:
                if self.game_efficiency < other.game_efficiency:
                    return True
                else:
                    return False
            else: 
                return False
        else:
            return False 
        
        # self.game_matches < other.game_matches or self.game_time > other.game_time or self.game_efficiency < other.game_efficiency
    def getDict(self):
        return {'rank':self.rank,'game_matches':self.game_matches,'game_time':self.game_time,'game_efficiency':self.game_efficiency}
        
    @staticmethod
    def getFirst():
        '''
        Return the highest score.
        '''
        return HighScores.query.filter_by(rank=1).first()
    
    @staticmethod
    def getLast():
        '''
        Return the lowest score.
        '''
        scores = HighScores.query.all()
        scores.sort(reverse=True)
        if len(scores) > 0:
            return scores[-1]
        else:
            return None
        
if __name__ == "__main__":
    db.create_all()
    app.run()




