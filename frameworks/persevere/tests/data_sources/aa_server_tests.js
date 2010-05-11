// the file name is aa_ so that it loads first
// I couldn't get sc_require to work here

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

module("Persevere.ServerTests", {
	setup: function() {
		var ServerTest = (window.ServerTest = SC.Object.create());
		
		ServerTest.createTestObjectClass = function () {
			return postUrl('/testserver/Class/', {'id':'TestObject', 'extends': {'$ref':'../Class/Object'}});
		};

		ServerTest.deleteTestObjectClass = function () {
			return SC.Request.deleteUrl("/testserver/Class/TestObject").json()
				.set('isAsynchronous', NO)
				.header('Accept', 'application/json')
				.send();
		};		

		// Helper method to create test object(s)
		// data can be a hash or an array of hashes
		// this uses Persevere's multiple post approach to make it easier to setup fixture data
	    // if data is an array the response contains a null Location header
	    // and the body contains an array with the objects with their id's set
		ServerTest.createTestObjects = function (data) {
			var response = postUrl('/testserver/TestObject/', data);
			equals(response.status, 201, 'TestObject created');
			return response;
		};
	},
	
	teardown: function() {
	}
});

test("Verify persevere is running", function() {
		
  // make a request here to see what we get back
  var response = getUrl("/testserver/Class/");
  var results = null;

  ok(SC.ok(response) && SC.ok(results = response.get('body')), 'response is ok');
  ok(SC.typeOf(results) === SC.T_ARRAY, 'response is array');
  ok(results.length > 0, 'response is not empty');  
});

test("Verify we can create and delete a TestObject Class", function() {

    var response;

    // verify that there is nothing there to start with 
	response = getUrl('/testserver/Class/TestObject');
    equals(response.status, 404, "TestObject Class doesn't exist");

	response = ServerTest.createTestObjectClass();
	equals(response.status, 201, 'TestObject created');

    // Note the location returned is not correct it doesn't include the port number
    // I assume this is passed through from persevere
    // var locationUrl = response.header('Location');
	// console.log("creation location: " + locationUrl);

    // to delete:
    // DELETE http://localhost:8080/testserver/Class/TestObject
	response = ServerTest.deleteTestObjectClass();
			
	// currently the webbrick and thin don't handle the response of the delete correctly
	// our guess is that the response has an empty body which appears to not be handled
	// by both the webbrick and thin proxies
	// after this error webrick returns a 500 and thin returns a 404
	ok(response.status === 500 || response.status === 404,
		'deleting TestObject response is ok, the proxying code doesn\'t handle this correctly: ' + response.status);
	
	response = getUrl('/testserver/Class/TestObject');
    equals(response.status, 404, "TestObject Class doesn't exist again, status");
	
});

test("Verify we can create a few objects in our test class", function (){
	ServerTest.createTestObjectClass();

    ServerTest.createTestObjects( [{name: "TestObject1"}, {name: "TestObject2"}]);

	var response, result;
    response = getUrl('/testserver/TestObject/');
    result = response.get('body');
    equals(result.length, 2, 'Result length is correct');
    equals(result[0].name, 'TestObject1', 'First result name is correct');
    equals(result[1].name, 'TestObject2', 'Second result name is correct');

	ServerTest.deleteTestObjectClass();

});
