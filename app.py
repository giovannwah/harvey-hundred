from flask import Flask, Response, jsonify, request
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
    ret = [{'rank': x.rank,
            'game_matches': x.game_matches,
            'game_time': x.game_time,
            'game_efficiency': x.game_efficiency,
            'user': x.user,
            'date': x.date,
            'location': x.location} for x in HighScores.query.all()]
    return jsonify(ret)

@app.route("/last-score", methods=['GET'])
def getLastScore():
    '''
    Get the score with the lowest rank in the database.
    '''
    x = HighScores.getLast()
    return jsonify({'rank': x.rank,
            'game_matches': x.game_matches,
            'game_time': x.game_time,
            'game_efficiency': x.game_efficiency,
            'user': x.user,
            'date': x.date,
            'location': x.location})

@app.route("/first-score", methods=['GET'])
def getFirstScore():
    '''
    Get the score with the highest rank in the database.
    '''
    x = HighScores.getFirst()
    return jsonify({'rank': x.rank,
            'game_matches': x.game_matches,
            'game_time': x.game_time,
            'game_efficiency': x.game_efficiency,
            'user': x.user,
            'date': x.date,
            'location': x.location})

@app.route("/add-score", methods=['POST'])
def addScore():
    '''
    Get new score, add to current list of scores, sort by rank, then remove extra items
    '''
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
        print(f'SCORE LENGTH: {len(scores)}')
        for sco in scores:
            print(sco)
        #clear current high scores table
        #HighScores.query.delete(scores)
        #db.session.query(HighScores).delete()
        #db.session.commit()
        #print('After DELETE')
        #print(f'scores length: {len(scores)}')
         
        scores.append(new_score)
        print('Before Sort...')
        for sco in scores: 
            print(sco)
        scores.sort(reverse=True)
        # assign new ranks after sorting scores
        for x in range(1, len(scores)+1):
            scores[x-1].rank = x
        print('After Sort and rank assignment...')
            
        for sco in scores: 
            print(sco)
        # Truncate extra scores
        if len(scores) > MAX_STORED_SCORES:
            for score in scores:
                if score.rank > MAX_STORED_SCORES:
                    db.session.remove(score)
        
        print('After Sort and rank assignment...')
            
        for sco in scores: 
            print(sco)
        #save scores 
        db.session.bulk_save_objects(scores)   
        #for score in scores: 
        #    db.session.add(score)
        db.session.commit()
        
    h = Headers()
    h.add('Content-Type', 'application/json')
    return Response(mimetype='application/json', response='{"message":"OK","status":"200"}', status='OK', headers=h)

@functools.total_ordering
class HighScores(db.Model):
    rank = db.Column(db.Integer, primary_key = True)
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
        return scores[-1]
        
if __name__ == "__main__":
    db.create_all()
    app.run()




