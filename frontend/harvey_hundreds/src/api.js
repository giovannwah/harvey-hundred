class GameAPI {
    constructor() {
        this.request = new XMLHttpRequest();
        this.request.responseType = 'json';
        this.testHost = 'http://127.0.0.1:5000/';   
        this.prodHost = '/';
        this.getScores = 'get-scores';
        this.addScore = 'add-score';
        this.firstScore = 'first-score';
        this.lastScore = 'last-score';
        this.test = true;
    }

    getRequest(callback, error, endpoint) {
        let url = this.test ? this.testHost + endpoint : this.prodHost + endpoint;
        this.request.onreadystatechange = function() {
            if (this.request.readyState === 4) {
                if (this.request.status === 200) {
                    callback(this.request.response)
                } else {
                    error(this.request.status)
                }
            }
        };
        this.request.ontimeout = error(408)
        this.request.open("GET", url , true);
        this.request.send(null);
    }

    addHighScore(callback, error, score) {
        let url = test ? this.testHost + this.addScore : this.prodHost + this.addScore;
        this.request.onreadystatechange = function() {
            if (this.request.readyState === 4) {
                if (this.request.status === 200) {
                    callback(this.request.response)
                } else {
                    error(this.request.status)
                }
            }
        };
        this.request.ontimeout = error(408)
        this.request.open("POST", url , true);
        this.request.send(JSON.stringify(score));
    }
}

export default GameAPI;
