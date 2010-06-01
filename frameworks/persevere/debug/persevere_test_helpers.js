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

// Helper function to convert status number to a string
// this was taken from SC.Record#statusString
SC.Record.mixin({
	statusString: function(status) {
	  var ret = [];

	  for(var prop in SC.Record) {
	    if(prop.match(/[A-Z_]$/) && SC.Record[prop]===status) {
	      ret.push(prop);
	    }
	  }

	  return ret.join(" ");  
	}	
});

// Helper function to make it easier to track down status errors
statusEquals = function(obj, status, message){
  equals(SC.Record.statusString(obj.get('status')), SC.Record.statusString(status), message);	
};

// Helper function to notify for a particular status
// it will call func immediately if the status matches
statusNotify = function(obj, status, func){
  // suspend property change notifications so we can atomically check if the status is changed
  // this should make the method more thread safe
  obj.beginPropertyChanges();

  if(obj.get('status') === status){
	console.log('statusNotify firing synchronously');
    func.call();
    
    // resume property change notifications
    obj.endPropertyChanges();	
    return;
  };
  var checkingFunc = function(){
	if(obj.get('status') === status){
	  // remove the observer incase the passed func causes it to fire again
	  obj.removeObserver('status', checkingFunc)
	  func.call();
	}
  };
  obj.addObserver('status', checkingFunc);

  // resume property change notifications
  // this should make the method more thread safe
  obj.endPropertyChanges();	
};