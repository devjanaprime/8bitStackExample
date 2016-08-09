$( document ).ready( function() {
    $( '#submit-button' ).on( 'click', postData );
    getData();
    $( '#outputDiv' ).on( 'click','.deactivateMe', deactivatePerson );
});

function deactivatePerson(){
  var deactivateID = $( this ).data( 'id' );
  console.log( 'id of record to deactivate: ' + deactivateID );

  var deactivateMe = {
    "id": deactivateID
  };
  console.log( 'object to send:', deactivateMe );
  $.ajax({
    type: 'PUT',
    url: '/deactivate',
    data: deactivateMe,
    success: function( data ){
      getData();
    }
  });
}// end function

function getData() {
    $.ajax({
        type: 'GET',
        url: '/records',
        success: function( data ) {
        showPeople( data );
        }
    });
}

function postData() {
    var newRecord = {
      "username": $( '#usernameIn' ).val(),
      "active": true
    };
    $.ajax({
        type: 'POST',
        url: '/newRecord',
        data: newRecord
    });
    // show the info already on the database
    getData();
}

function showPeople( peeps ){
  console.log( "in showPeople: ", peeps );
  // empty output div and input field
  $( '#usernameIn' ).val( "" );
  $( '#outputDiv' ).empty();
  // append each row to output div
  for( var i=0; i<peeps.length; i++ ){
      $( '#outputDiv' ).append( '<p><b>User: ' + peeps[ i ].username + '</b></p>' );
      $( '#outputDiv' ).append( '<p>Active: ' + peeps[ i ].active + ", created: " + peeps[ i ].created + '</p>' );
      $( '#outputDiv' ).append( '<button class="deactivateMe" data-id="' + peeps[ i ].id + '">Deactive</button>' );
  }
}
