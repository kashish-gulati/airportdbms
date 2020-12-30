const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');
const fs = require('fs');

let db = new sqlite3.Database('./airport.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the airport database.');
});

http.createServer(function(req,res){
    let q = url.parse(req.url, true);
    let filename = "." + (q.pathname==='/'?'/index.html':q.pathname);
    
    fs.readFile(filename, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        if(q.pathname=='/airport.html'&&q.query.airportname&&q.query.state&&q.query.country&&q.query.city){
            db.run('INSERT INTO AIRPORT (AP_NAME, STATE, COUNTRY, CNAME) VALUES(\"'+q.query.airportname+'\",\"'+q.query.state+'\",\"'+q.query.country+'\",\"'+q.query.city+'\");',function(err){
                if(err){
                    return console.log(err);
                }
                return console.log('airport data added successfully');
            });
            res.writeHead(301,{Location: 'http://localhost:8080'+'/'});
            return res.end();
        }
        if(q.pathname=='/employee.html'&&q.query.ssn&&q.query.firstName&&q.query.lastName&&q.query.address&&q.query.phone&&q.query.age&&q.query.jobtype&&q.query.salary&&q.query.airportname&&q.query.gender){
            db.run('INSERT INTO EMPLOYEE VALUES(\"'+q.query.ssn+'","'+q.query.firstName+'","'+q.query.middleName+'","'+q.query.lastName+'","'+q.query.address+'","'+q.query.phone+'","'+q.query.age+'","'+q.query.gender+'","'+q.query.jobtype+'","'+q.query.salary+'","'+q.query.airportname+'\");',function(err){
                if(err){
                    return console.log(err);
                }
                return console.log('employee data added successfully');
            });
            res.writeHead(301,{Location: 'http://localhost:8080'+'/'});
            return res.end();
        }
        if(q.pathname=='/flights.html'&&q.query.flightcode&&q.query.source&&q.query.destination&&q.query.departure&&q.query.arrival&&q.query.status&&q.query.duration&&q.query.flighttype&&q.query.airlines){
            db.run('INSERT INTO FLIGHT VALUES(\"'+q.query.flightcode+'","'+q.query.source+'","'+q.query.destination+'","'+q.query.departure+'","'+q.query.arrival+'","'+q.query.status+'","'+q.query.duration+'","'+q.query.flighttype+'","'+q.query.airlines+'\");',function(err){
                if(err){
                    return console.log(err);
                }
                return console.log('flight data added successfully');
            });
            res.writeHead(301,{Location: 'http://localhost:8080'+'/'});
            return res.end();
        }
        if(q.pathname=='/passenger.html'&&q.query.pid&&q.query.firstName&&q.query.lastName&&q.query.address&&q.query.phone&&q.query.age&&q.query.gender&&q.query.flightcode){
            db.run('INSERT INTO PASSENGER VALUES('+q.query.pid+',"'+q.query.firstName+'","'+q.query.middleName+'","'+q.query.lastName+'","'+q.query.address+'",'+q.query.phone+','+q.query.age+',"'+q.query.gender+'","'+q.query.flightcode+'\");',function(err){
                if(err){
                    return console.log(err);
                }
                return console.log('passenger data added successfully');
            });
            res.writeHead(301,{Location: 'http://localhost:8080'+'/'});
            return res.end();
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        //res.write('<p>extra paragraph</p>')
        return res.end();
    });
    //console.log('listening');
    console.log(req.url);
}).listen(8080);

//db.close();