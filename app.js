// for this example the database should be named "introToSQL"
// with fields: username(varchar), active(boolean), created(timestamp)
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
// static folder
app.use( express.static( "public" ) );
// for POST functionality
var urlencodedParser=bodyParser.urlencoded( { extended: false } );
// pg module for postgres
var pg = require('pg');
// default postgress port is 5432 the end of the URL is yourDB name
var connectionString  = 'postgres://localhost:5432/introToSQL';

// our connection
console.log( "connectionString: " + connectionString );

//spin up server
app.listen( '5000', 'localhost', function( req, res ){
  console.log( 'listeing on 5000' );
});

// base url
app.get('/', function(req, res) {
  console.log( 'in base url' );
  res.sendFile( path.resolve( 'views/index.html' ) );
});


app.put ('/deactivate', urlencodedParser, function( req, res ) {
  console.log( 'deactivating user with id:', req.body );
  pg.connect( connectionString, function( err, client, done ) {
      if(err) {
        // was there an error? let us know if so
        console.log(err);
      }
      else{
        // no error, carry on...
        console.log( 'connected to db' );
        client.query( 'UPDATE users set active=false where id=' + req.body.id );
        res.send( true );
      }
  });
});

// ceate a new record
app.post( '/newRecord', urlencodedParser, function( req, res ) {
    console.log( 'in newRecord post: ' + req.body.username + ", " + req.body.active );
    pg.connect( connectionString, function( err, client, done ) {
      client.query( 'INSERT INTO users( username, active, created ) values( $1, $2, $3 )', [ req.body.username, req.body.active, 'NOW()' ] );
    }); // end connect
}); // end post

// get records route
app.get( '/records', function( req, res ) {
    // results will hold our results
    var results = [];
    pg.connect( connectionString, function( err, client, done ) {
        var query = client.query( 'SELECT * FROM users ORDER BY active DESC;' );
        // stream results back one row at a time and push into "results"
        query.on( 'row', function( row ) {
            results.push( row );
        }); // end row
        // close connection
        query.on('end', function() {
            done();
            // rend back results as a json
            return res.json(results);
        }); // end onEnd
        if(err) {
            console.log(err);
        } // end error
    }); // end connect
}); // end people get
