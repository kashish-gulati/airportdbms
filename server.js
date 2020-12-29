const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');
const fs = require('fs');

http.createServer(function(req,res){
    let q = url.parse(req.url, true);
    let filename = "." + (q.pathname==='/'?'/index.html':q.pathname);
    let db = new sqlite3.Database('./airport.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the airport database.');
      });
    fs.readFile(filename, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        if(q.query.airportname&&q.query.state&&q.query.country&&q.query.city){

            res.writeHead(301,{Location: 'http://localhost:8080'+'/'});
            return res.end();
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.write('<p>extra paragraph</p>')
        return res.end();
    });
    
    console.log(q.query);
}).listen(8080);