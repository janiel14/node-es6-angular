import { Express } from './lib/Express';
import http from 'http';
const express  = new Express();
express.listen().then((app) => {
    const serverHttp = http.createServer(app);
    serverHttp.listen(app.get('port'), function() {
        console.log('Express Server listen: ' + app.get('port'));
        console.log('Enviroment: ', app.env);
        console.log('MongoDB: connected');
    });
}).catch((error) => {
    console.error('Error: ', error);
    process.exit(0);
});