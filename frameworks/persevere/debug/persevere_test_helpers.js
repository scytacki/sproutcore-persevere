ServerTest = SC.Object.create(Persevere.ServerMixin, {
	createTestObjectClass: function () {
		return this._post('Class', {'id':'TestObject', 'extends': {'$ref':'../Class/Object'}});
	},

	deleteTestObjectClass: function () {
		return this._delete('Class', 'TestObject');		
	},

	// Helper method to create test object(s)
	// data can be a hash or an array of hashes
	// this uses Persevere's multiple post approach to make it easier to setup fixture data
	// if data is an array the response contains a null Location header
	// and the body contains an array with the objects with their id's set
	createTestObjects: function (data) {
		var response = this._post('TestObject', data);
		equals(response.status, 201, 'TestObject created');
		return response;
	},
});

// Create example data model classes
// This has to be done in a helper like this if it is put in a file in the 
// This code can't be done in the setup method of a test because then it will
// run multiple times and then SproutCores classNaming code will not work correctly
Sample = SC.Object.create();
Sample.File = SC.Record.extend({ test:'hello'});
Sample.Directory = SC.Record.extend({test2: 'hello'});


