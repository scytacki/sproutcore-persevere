var store, ds;

module("Persevere.SchemaLessDataSource", {
  setup: function() {
    SC.RunLoop.begin();

    Sample.FILES_QUERY = SC.Query.local(Sample.File, {});
    Sample.DIRS_QUERY = SC.Query.local(Sample.Directory, {});

    ds = Persevere.SchemaLessSource.create({
      prsvClassName: 'TestObject'
    });
    store = SC.Store.create({
      // turn this on so we don't have commit them manually
      commitRecordsAutomatically: YES
    }).from(ds);

    ServerTest.createTestObjectClass();
    ServerTest.createTestObjects([{
      sc_type: 'Sample.File',
      name: "TestObject1"
    },
    {
      sc_type: 'Sample.File',
      name: "TestObject2"
    },
    {
      sc_type: 'Sample.Directory',
      name: "TestObject3"
    },
    {
      sc_type: 'Sample.Directory',
      name: "TestObject4"
    },
    {
      sc_type: 'Sample.Directory',
      name: "TestObject5"
    }]);

  },

  teardown: function() {
    ServerTest.deleteTestObjectClass();
    // Make sure the store is totally gone
    store = null;
    SC.RunLoop.end();
  }
});

test("find() throws error if an invalid query is passed",
function() {
  var exception = null;
  try {
    // pass in an invalid query object
    // note that refreshQuery is never supposed to be called directly so 
    // this probably will never happen
    store.refreshQuery(SC.Object.create());
  } catch(exp) {
    exception = exp;
  }
  ok(exception !== null, 'Exception should have been thrown with invalid query: ' + exception);
});

// Following the order of the sproutcore todo's tutorial
// we verify the fetch method first
test("Verify find() correctly loads File records",
function() {
  var files = store.find(Sample.FILES_QUERY);

  // force fetch to be async
  statusEquals(files, SC.Record.BUSY_LOADING, "files array is being loaded");

  // setup timeout in case of failure
  stop(200);

  // Wait for the status to change to READY_CLEAN
  statusNotify(files, SC.Record.READY_CLEAN,
  function() {
    equals(files.get('length'), 2, 'returns 2 records');
    start();
  });
});

test("Verify find() correctly loads Directory records",
function() {
  var dirs = store.find(Sample.DIRS_QUERY);

  // force fetch to be async
  statusEquals(dirs, SC.Record.BUSY_LOADING, "dirs array is being loaded");

  // setup timeout in case of failure
  stop(200);

  // Wait for the status to change to READY_CLEAN
  statusNotify(dirs, SC.Record.READY_CLEAN,
  function() {
    equals(dirs.get('length'), 3, 'returns 3 records');
    start();
  });
});

test("Verify fetch handles a record object that causes an invalid query",
function() {

  Sample.Fake = SC.Record.extend({
    test: 'hello'
  });

  // Need to mess up the query that is sent to persevere so it will return a error
  // Currently it constructs the query string using classname
  Sample.Fake._object_className = 'invalid"&name';

  var fakes = store.find(SC.Query.local(Sample.Fake, {}));

  // force fetch to be async
  statusEquals(fakes, SC.Record.BUSY_LOADING, "fakes array is being loaded");

  // setup timeout in case of failure
  stop(200);

  // Wait for the status to change to ERROR
  statusNotify(fakes, SC.Record.ERROR,
  function() {
    ok(true, 'record array has an error status after the invalid request');
    start();
  });
});

test("Verify find() can get File record by type and id",
function() {
  stop(200);

  var sf = store.find(Sample.File, "1");

  statusNotify(sf, SC.Record.READY_CLEAN,
  function() {
    equals(sf.get('name'), 'TestObject1', 'returned record has correct name');
    start();
  });
});

test("Verify find() can get Directory record by type and id",
function() {
  stop(200);

  var sd = store.find(Sample.Directory, "3");

  statusNotify(sd, SC.Record.READY_CLEAN,
  function() {
    equals(sd.get('name'), 'TestObject3', 'returned record has have correct name');
    start();
  });
});

test("Verify find() returns a server error with an invalid id",
function() {
  stop(200);

  var badDir = store.find(Sample.Directory, "[");

  statusNotify(badDir, SC.Record.ERROR,
  function() {
    ok(true, 'Invalid id correctly caused ERROR status');
    start();
  });
});

test("Verify create",
function() {
  var sf = store.createRecord(Sample.File, {
    name: 'CreatedObject1'
  });

  // need to end the run loop inorder for the auto commit to fire
  // alternatively we could call store.commitRecords directly
  SC.RunLoop.end();
  SC.RunLoop.begin();

  // force create to be async
  statusEquals(sf, SC.Record.BUSY_CREATING, "file record is being created");

  // We should query persevere directly to see if it was created
  stop(400);

  statusNotify(sf, SC.Record.READY_CLEAN,
  function() {
    console.log("new id: " + sf.get('id'));
    console.log("new obj name: " + sf.get('name'));
    var sf1 = store.find(Sample.File, sf.get('id'));

    // This probably isn't the best test, to be sure it should look directly
    // at the server
    equals(sf1, sf, 'created record equals found record');
    start();
  });
});

// Note this test requires retrieveRecord to be implemented correctly inorder for it to work
test("Verify update",
function() {
  stop(400);

  // It would be nice to find a way around this call, so this test would be independent
  var sf = store.find(Sample.File, "1");

  statusNotify(sf, SC.Record.READY_CLEAN,
  function() {
    console.log('updating record with store: ' + store);
    sf.set('name', 'UpdatedTestObject1');

    // need to end the run loop inorder for the auto commit to fire
    // alternatively we could call store.commitRecords directly
    SC.RunLoop.end();
    SC.RunLoop.begin();

    // force update to be async
    statusEquals(sf, SC.Record.BUSY_COMMITTING, "file record is being updated");

    // check server directly
    statusNotify(sf, SC.Record.READY_CLEAN,
    function() {
      var response = ServerTest._get('TestObject', sf.get('id'));
      var objHash = response.get('body');
      equals(objHash.name, 'UpdatedTestObject1', 'updated record has correct name');
      
      // verify there is only 5 objects in the server after the update
      response = null;
      response = ServerTest._get('TestObject');
      objHash = response.get('body');
      equals(objHash.length, 5, "server doesn't have any new objects");
      
      start();
    });
  });
});

// Note this test requires retrieveRecord to be implemented correctly inorder for it to work
test("Verify create then update",
function() {
  var sf = store.createRecord(Sample.File, {
    name: 'CreatedObject1'
  });

  // need to end the run loop inorder for the auto commit to fire
  // alternatively we could call store.commitRecords directly
  SC.RunLoop.end();
  SC.RunLoop.begin();

  // force create to be async
  statusEquals(sf, SC.Record.BUSY_CREATING, "file record is being created");

  // We should query persevere directly to see if it was created
  stop(400);

  statusNotify(sf, SC.Record.READY_CLEAN,
  function() {
    var sfId = sf.get('id');
    console.log("new id: " + sfId);

    sf.set('name', 'UpdatedTestObject1');
    
    // need to end the run loop inorder for the auto commit to fire
    // alternatively we could call store.commitRecords directly
    SC.RunLoop.end();
    SC.RunLoop.begin();

    // force update to be async
    statusEquals(sf, SC.Record.BUSY_COMMITTING, "file record is being updated");

    // check server directly
    statusNotify(sf, SC.Record.READY_CLEAN,
      function() {
        var response = ServerTest._get('TestObject', sfId);
        var objHash = response.get('body');

        equals(objHash.name, 'UpdatedTestObject1', 'updated record has correct name');
        
        // verify there is only 6 objects in the server after the create and update
        response = null;
        response = ServerTest._get('TestObject');
        objHash = response.get('body');
        equals(objHash.length, 6, "server doesn't have any new objects");
        
        start();
      });
  });

});

// Note this test requires retrieveRecord to be implemented correctly inorder for it to work
test("Verify remove",
function() {
  // expect 5 assertions
  expect(5);
  var response;

  // double check that the object is there on the server
  response = ServerTest._get('TestObject', '1');
  equals(response.status, 200, "object exists on the server");

  var sf;

  stop(500,
  function() {
    this.fail("Test timed out and record has status: " + SC.Record.statusString(sf.get('status')));
  });

  sf = store.find(Sample.File, "1");

  statusNotify(sf, SC.Record.READY_CLEAN,
  function() {
    console.log('destroying record with store: ' + store);
    sf.destroy();

    // need to end the run loop inorder for the auto commit to fire
    // alternatively we could call store.commitRecords directly
    SC.RunLoop.end();
    SC.RunLoop.begin();

    // force update to be async
    statusEquals(sf, SC.Record.BUSY_DESTROYING, "file record is being destroyed");

    statusNotify(sf, SC.Record.DESTROYED_CLEAN,
    function() {
      var sf1 = store.find(Sample.File, 1);

      // find still returns a valid object but its status is DESTROYED_CLEAN
      // I can't find a way to make it return null
      ok(sf1.isDestroyed(), 'Record successfully destroyed: ' + sf1);

      // check the actual server to see if the record is gone
      response = null;
      response = ServerTest._get('TestObject', '1');
      equals(response.status, 404, "Object should be gone from the server");
      start();
    });
  });

  console.log('this.isRunning: ' + this.isRunning);
});
