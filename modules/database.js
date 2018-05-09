class Database {
    constructor() {
        this.mongoose = require('mongoose');
    }
    
    connect(url, app) {
        this.mongoose.connect(url).then(() => {
            console.log('Connected successfully.');
        }, err => {
            console.log('Connection to db failed: ' + err);
        });
    }

    getSchema(name) {
        const scoreSchema = {
            'game': String,
            'name': String,
            'score': Number,
            'date': String
        };
        const s = new this.mongoose.Schema(scoreSchema);
        return this.mongoose.model(name, s);
    }
}

module.exports = new Database();
