ServerTest = SC.Object.create({
	createTestObjectClass: function (ds) {
		return ds._post('Class', {'id':'TestObject', 'extends': {'$ref':'../Class/Object'}});
	},

	deleteTestObjectClass: function (ds) {
		return SC.Request.deleteUrl(ds.basePath + "/Class/TestObject").json()
			.set('isAsynchronous', NO)
			.header('Accept', 'application/json')
			.send();
	},

	// Helper method to create test object(s)
	// data can be a hash or an array of hashes
	// this uses Persevere's multiple post approach to make it easier to setup fixture data
	// if data is an array the response contains a null Location header
	// and the body contains an array with the objects with their id's set
	createTestObjects: function (ds, data) {
		var response = ds._post('TestObject', data);
		equals(response.status, 201, 'TestObject created');
		return response;
	},
});

// Create example data model classes
Sample = SC.Object.create();
Sample.File = SC.Record.extend({ test:'hello'});
Sample.Directory = SC.Record.extend({test2: 'hello'});


