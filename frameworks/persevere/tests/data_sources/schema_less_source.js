var store, datasource;

module("Persevere.SchemaLessDataSource", {
	setup: function() {
		SC.RunLoop.begin();

	    var Sample = (window.Sample= SC.Object.create());
	    Sample.File = SC.Record.extend({ test:'hello'});
	
	    datasource = Persevere.SchemaLessSource.create();
  	    store = SC.Store.create().from(datasource);	
	},
	
	teardown: function() {
		SC.RunLoop.end();
	}
});

// This is a pending test it should fail
test("Verify find() loads data from store", function() {
  var sk=store.find(Sample.File, "1");
  equals(sk.get('name'), 'First record name', 'returns record should have name from hash');
});
