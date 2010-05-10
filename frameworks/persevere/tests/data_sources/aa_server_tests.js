// the file name is aa_ so that it loads first
// I couldn't get sc_require to work here

module("Persevere.ServerTests", {
	setup: function() {
	},
	
	teardown: function() {
	}
});

test("Verify persevere is running", function() {
		
  // make a request here to see what we get back
  // http://localhost:4020/testserver/Class/
  var response = SC.Request.getUrl("/testserver/Class/").set('isAsynchronous', NO).json()
    .header('Accept', 'application/json')
	.send()

  ok(SC.ok(response) && SC.ok(results = response.get('body')), 'response is ok');
  ok(SC.typeOf(results) === SC.T_ARRAY, 'response is array');
  ok(results.length > 0, 'response is not empty');  
});

