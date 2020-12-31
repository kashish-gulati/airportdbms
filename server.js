const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');
const fs = require('fs');
const ejs = require('ejs');
const { rosybrown } = require('color-name');

const fsp = fs.promises;

let db = new sqlite3.Database('./airport.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the airport database.');
});

http.createServer(function(req,res){
    let q = url.parse(req.url, true);
    let filename = "." + (q.pathname==='/'?'/first.html':q.pathname);
    
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
        if(q.pathname=='/airportsearch.html'&&q.query.ap_name){
            db.get('SELECT * FROM AIRPORT WHERE AP_NAME = "'+q.query.ap_name+'";', (err, row) => {
                if (err) {
                  return console.error(err.message);
                }
                if(row){
                    var ht=fs.readFileSync('./airportresult.ejs', 'utf-8');
                    var htren=ejs.render(ht,{filename:'airportresult.ejs',ap_name:row.AP_NAME,state:row.STATE,country:row.COUNTRY,city:row.CNAME});
                    //dat=row;
                    console.log(htren);
                    //fs.unlink('./result.html');
                    fsp.writeFile('./result.html', htren);
                    return htren;
                }
            });
            res.writeHead(301, {Location: './result.html'});
            res.write('Test');
            return res.end();
        }
        if(q.pathname=='/employeesearch.html'&&q.query.ssn){
            db.get('SELECT * FROM EMPLOYEE WHERE SSN = '+q.query.ssn+';', (err, row) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log(row);
                if(row){
                    var ht=fs.readFileSync('./employeeresult.ejs', 'utf-8');
                    var htren=ejs.render(ht,{filename:'employeeresult.ejs',ap_name:row.AP_NAME,ssn:row.SSN,fname:row.FNAME,mname:row.M,lname:row.LNAME,address:row.ADDRESS,phone:row.PHONE,sex:row.SEX,jobtype:row.JOBTYPE,salary:row.SALARY,age:row.AGE});
                    
                    console.log(htren);
                    //fsp.unlink('./result.html');
                    fsp.writeFile('./resultE.html', htren);
                    return htren;
                }
            });
            res.writeHead(301, {Location: './resultE.html'});
            res.write('Test');
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