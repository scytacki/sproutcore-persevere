ServerTest = SC.Object.create({
	createTestObjectClass: function () {
		return this.postUrl('/testserver/Class/', {'id':'TestObject', 'extends': {'$ref':'../Class/Object'}});
	},

	deleteTestObjectClass: function () {
		return SC.Request.deleteUrl("/testserver/Class/TestObject").json()
			.set('isAsynchronous', NO)
			.header('Accept', 'application/json')
			.send();
	},

	// Helper method to create test object(s)
	// data can be a hash or an array of hashes
	// this uses Persevere's multiple post approach to make it easier to setup fixture data
	// if data is an array the response contains a null Location header
	// and the body contains an array with the objects with their id's set
	createTestObjects: function (data) {
		var response = this.postUrl('/testserver/TestObject/', data);
		equals(response.status, 201, 'TestObject created');
		return response;
	},

	getUrl: function(url) {
		return SC.Request.getUrl(url).set('isAsynchronous', NO).json()
		    .header('Accept', 'application/json')
			.send();
	},

	postUrl: function(url, data) {
		return SC.Request.postUrl(url).json()
			.set('isAsynchronous', NO)
			.header('Accept', 'application/json')
			.send(data);
	}
});

