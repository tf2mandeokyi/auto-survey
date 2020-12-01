import { EduroSurveyApi } from './src/eduroapi';
import { DatabaseConnector } from './src/server/database';
import * as jsonreader from './src/json/jsonreader';

(async function() {
    let json = jsonreader.readSync('./db.json');

    console.log('connecting database...')

    let dbc = new DatabaseConnector({
        host: json['host'],
        user: json['user'],
        password: json['password'],
    })

    console.log('setting up...')

    await dbc.connect();
    await dbc.setupDatabase();
})().then(console.log);


