// the file name is aa_ so that it loads first
// I couldn't get sc_require to work here

module("Persevere.ServerTests", {
	setup: function() {
	},
	
	teardown: function() {
	}
});

var getUrl = function(url) {
	return SC.Request.getUrl(url).set('isAsynchronous', NO).json()
	    .header('Accept', 'application/json')
		.send();
};

var postUrl = function(url, data) {
	return SC.Request.postUrl(url).json()
		.set('isAsynchronous', NO)
		.header('Accept', 'application/json')
		.send(data);	
};

test("Verify persevere is running", function() {
		
  // make a request here to see what we get back
  var response = getUrl("/testserver/Class/");
  var results = null;

  ok(SC.ok(response) && SC.ok(results = response.get('body')), 'response is ok');
  ok(SC.typeOf(results) === SC.T_ARRAY, 'response is array');
  ok(results.length > 0, 'response is not empty');  
});

test("Verify we can create and delete a new Class", function() {
  // make a request here to see what we get back
  // http://localhost:4020/testserver/Class/
	//   var response = SC.Request.getUrl("/testserver/Class/").set('isAsynchronous', NO).json()
	//     .header('Accept', 'application/json')
	// .send()

    // verify that there is nothing there to start with 
    var response, results;

	response = getUrl('/testserver/Class/TestObject');
    equals(response.status, 404, "TestObject Class doesn't exist");

	// to add:
	// POST http://localhost:8080/testserver/Class/
	// content type: 	application/x-www-form-urlencoded
	// {"id":"TestObject","extends":{"$ref":"../Class/Object"}}
	// this is a json post, however it might not be in the same format that SC sends by default.
	response = postUrl('/testserver/Class/', {'id':'TestObject', 'extends': {'$ref':'../Class/Object'}});
	equals(response.status, 201, 'TestObject created');
    console.log("results: " + response.get('body'));

    // Note the location returned is not correct it doesn't include the port number
    // I assume this is passed through from persevere
    var locationUrl = response.header('Location');
	console.log("creation location: " + locationUrl);

    // to delete:
    // DELETE http://localhost:8080/testserver/Class/TestObject
    results = null;
	response = SC.Request.deleteUrl("/testserver/Class/TestObject").json()
		.set('isAsynchronous', NO)
		.header('Accept', 'application/json')
		.send();
		
	// currently the webbrick doesn't handle the return value of the delete correctly
	equals(response.status, 500, 'deleting TestObject response is ok, the proxying code doesn\'t handle this correctly');
	
	response = getUrl('/testserver/Class/TestObject');
    equals(response.status, 404, "TestObject Class doesn't exist again, status");
	
});
