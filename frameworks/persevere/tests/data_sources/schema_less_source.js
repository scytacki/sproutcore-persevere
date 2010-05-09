var store, datasource;

module("Persevere.SchemaLessDataSource", {
	setup: function() {
		SC.RunLoop.begin();

	    var Sample = (window.Sample= SC.Object.create());
	    Sample.File = SC.Record.extend({ test:'hello'});

	    Sample.FILES_QUERY = SC.Query.local(Sample.File, {});
	
	    datasource = Persevere.SchemaLessSource.create();
  	    store = SC.Store.create().from(datasource);	
	},
	
	teardown: function() {
		SC.RunLoop.end();
	}
});

test("Verify find() loads data from store", function() {
  var sk=store.find(Sample.File, "1");
  equals(sk.get('name'), 'First record name', 'returns record should have name from hash');
});

test("Verify find() correctly loads fixed data", function() {
  var files = store.find(Sample.FILES_QUERY);
  equals(files.get('length'), 2, 'returns 2 records');
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