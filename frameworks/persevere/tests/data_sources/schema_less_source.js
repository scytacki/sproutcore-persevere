var store, datasource;

module("Persevere.SchemaLessDataSource", {
	setup: function() {
		SC.RunLoop.begin();

	    var Sample = (window.Sample= SC.Object.create());
	    Sample.File = SC.Record.extend({ test:'hello'});
	    Sample.FILES_QUERY = SC.Query.local(Sample.File, {});
	
	    Sample.Directory = SC.Record.extend({});
	    Sample.DIRS_QUERY = SC.Query.local(Sample.Directory, {});

	    datasource = Persevere.SchemaLessSource.create();
  	    store = SC.Store.create().from(datasource);	
	},
	
	teardown: function() {
		SC.RunLoop.end();
	}
});

// Following the order of the sproutcore todo's tutorial
// we verify the fetch method first
test("Verify find() correctly loads fixed data", function() {
  ServerTest.createTestObjectClass();
  ServerTest.createTestObjects( [
	{sc_type: 'Sample.File', name: "TestObject1"},
	{sc_type: 'Sample.File', name: "TestObject2"},
	{sc_type: 'Sample.Directory', name: "TestObject3"}]);

  var files = store.find(Sample.FILES_QUERY);
  equals(files.get('length'), 2, 'returns 2 records');
  ServerTest.deleteTestObjectClass();
});

test("Verify find() loads data from store", function() {
  var sk=store.find(Sample.File, "1");
  equals(sk.get('name'), 'First record name', 'returns record should have name from hash');
});


