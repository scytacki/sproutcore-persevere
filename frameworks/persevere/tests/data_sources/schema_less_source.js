var store, datasource;

module("Persevere.SchemaLessDataSource", {
	setup: function() {
		SC.RunLoop.begin();

	    Sample.FILES_QUERY = SC.Query.local(Sample.File, {});	
	    Sample.DIRS_QUERY = SC.Query.local(Sample.Directory, {});

	    var ds = Persevere.SchemaLessSource.create();
        store = SC.Store.create().from(ds);

	    ServerTest.createTestObjectClass(ds);
	    ServerTest.createTestObjects(ds, [
		{sc_type: 'Sample.File', name: "TestObject1"},
		{sc_type: 'Sample.File', name: "TestObject2"},
		{sc_type: 'Sample.Directory', name: "TestObject3"},
		{sc_type: 'Sample.Directory', name: "TestObject4"},
		{sc_type: 'Sample.Directory', name: "TestObject5"}]);

	},
	
	teardown: function() {
	    ServerTest.deleteTestObjectClass(ds);
		SC.RunLoop.end();
	}
});

// Following the order of the sproutcore todo's tutorial
// we verify the fetch method first
test("Verify find() correctly loads File fixture data", function() {
  var files = store.find(Sample.FILES_QUERY);
  equals(files.get('length'), 2, 'returns 2 records');
});

test("Verify find() correctly loads Directory fixture data", function() {
  var dirs = store.find(Sample.DIRS_QUERY);
  equals(dirs.get('length'), 3, 'returns 3 records');
});

test("Verify find() loads data from store", function() {
  var sk=store.find(Sample.File, "1");
  equals(sk.get('name'), 'First record name', 'returns record should have name from hash');
});


