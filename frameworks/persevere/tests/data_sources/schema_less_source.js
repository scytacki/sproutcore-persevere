var store, ds;

module("Persevere.SchemaLessDataSource", {
	setup: function() {
		SC.RunLoop.begin();

	    Sample.FILES_QUERY = SC.Query.local(Sample.File, {});	
	    Sample.DIRS_QUERY = SC.Query.local(Sample.Directory, {});

	    ds = Persevere.SchemaLessSource.create();
        store = SC.Store.create({
	        // turn this on so we don't have commit them manually
			commitRecordsAutomatically: YES
		}).from(ds);

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

test("Verify find() can get objects by type and id", function() {
  var sf=store.find(Sample.File, "1");
  equals(sf.get('name'), 'TestObject1', 'returned record has correct name');

  var sd = store.find(Sample.Directory, "3");
  equals(sd.get('name'), 'TestObject3', 'returned record has have correct name');
});

test("Verify create", function() {
  var sf = store.createRecord(Sample.File, {name: 'CreatedObject1'});

  // need to end the run loop inorder for the auto commit to fire
  // alternatively we could call store.commitRecords directly
  SC.RunLoop.end();

  // We should add code here to verify that the createRecord was called on the
  // source
  // or we should query persevere directly to see if it was created

  SC.RunLoop.begin();
  console.log("new id: " + sf.get('id'));
  console.log("new obj name: " + sf.get('name'));
  var sf1 = store.find(Sample.File, sf.get('id'));

  // This probably isn't the best test, to be sure it should look directly
  // at the server
  equals(sf1, sf, 'created record equals found record');
});

test("Verify update", function() {
  var sf=store.find(Sample.File, "1");
  sf.set('name', 'UpdatedTestObject1');

  // need to end the run loop inorder for the auto commit to fire
  // alternatively we could call store.commitRecords directly
  SC.RunLoop.end();

  SC.RunLoop.begin();
  var sf1 = store.find(Sample.File, sf.get('id'));

  // This probably isn't the best test, to be sure it should look directly
  // at the server
  equals(sf1.get('name'), 'UpdatedTestObject1', 'updated record has correct name');

});

test("Verify remove", function() {
  var sf=store.find(Sample.File, "1");
  sf.destroy();

  // need to end the run loop inorder for the auto commit to fire
  // alternatively we could call store.commitRecords directly
  SC.RunLoop.end();

  SC.RunLoop.begin();
  var sf1 = store.find(Sample.File, 1);

  // find still returns a valid object but its status is DESTROYED_CLEAN
  // I can't find a way to make it return null
  ok(sf1.isDestroyed(), 'Record successfully destroyed');
});