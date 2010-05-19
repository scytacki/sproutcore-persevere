// A set of methods used both by schema_less_source and the tests
Persevere.ServerMixin = {
  basePath: "/testserver",

  _get: function(klass, query) {
	    if(!query) var query = '';

		return SC.Request.getUrl(this.basePath + "/" + klass + "/" + query).set('isAsynchronous', NO).json()
		    .header('Accept', 'application/json')
			.send();
  },

  _post: function(klass, data) {
		return SC.Request.postUrl(this.basePath + "/" + klass + "/").json()
			.set('isAsynchronous', NO)
			.header('Accept', 'application/json')
			.send(data);
  },


  _put: function(klass, id, data) {
	return SC.Request.putUrl(this.basePath + "/" + klass + "/" + id).json()
	      .set('isAsynchronous', NO)
		  .header('Accept', 'application/json')
	      .send(data);
  },

  _delete: function(klass, id) {
	return SC.Request.deleteUrl(this.basePath + "/" + klass + "/" + id).json()
		.set('isAsynchronous', NO)
		.header('Accept', 'application/json')
		.send();
  },

  _deleteResponseOk: function(response) {
	// the sproutcore gem proxying code doesn\'t handle delete correctly
	// if this is used with sproutcore master this function can probably
	// be a simple SC.ok(response);
	return response.status === 500 || response.status === 404 || response.status === 200;
  }

};