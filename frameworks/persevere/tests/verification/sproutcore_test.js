module("Persevere.SproutCoreVerification");

test("Verify classnames are messed up for objects created after the first call to SC._object_className", function(){	
	window.TestClass = SC.Object.extend({something: "here"});
	equals(SC._object_className(TestClass), "TestClass", 
	  "SC._object_className(TestClass) returns the correct classname");
	
	window.TestClass2 = SC.Object.extend({something: "here"});
	equals(SC._object_className(TestClass2), "SC.Object", 
	  "SC._object_className(TestClass2) returns the incorrect classname because it only computes class names once and it already did so");
	
	window.TestClass = SC.Object.extend({something2: "here"});
	equals(SC._object_className(TestClass), "SC.Object", 
	  "SC._object_className(TestClass) returns the incorrect classname because the redefined TestClass inherits its classname from the parent, and it only computes classnames once");
});