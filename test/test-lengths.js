var Lengths=require("../lengths");
var assert=require("assert");

var createsamelength=function(l){
		var lengths=new Lengths();
		for (var i=0;i<1000;i++) {
			lengths.add(l);
		}
		lengths.build();
		return lengths;
}


describe("lengths",function(){
	it("accumulated length",function(){
		var lengths=createsamelength(1);
		assert.deepEqual(lengths._ACC(), [256,512,768,1000]);
	});

	it("pos2lineoff",function(){
		var lengths=createsamelength(2);

		var lo=lengths.pos2lineoff(0);
		assert.deepEqual(lo,[0,0]);

		lo=lengths.pos2lineoff(2);
		assert.deepEqual(lo,[1,0]);

		lo=lengths.pos2lineoff(1);
		assert.deepEqual(lo,[0,1]);

		lo=lengths.pos2lineoff(256);
		assert.deepEqual(lo,[128,0]);

		lo=lengths.pos2lineoff(255);
		assert.deepEqual(lo,[127,1]);

		lo=lengths.pos2lineoff(1998);
		assert.deepEqual(lo,[999,0]);

		lo=lengths.pos2lineoff(1999);
		assert.deepEqual(lo,[999,1])

		lo=lengths.pos2lineoff(2000);
		assert.equal(lo,null)
	});

	it("lineoff2pos",function(){
		var lengths=createsamelength(2);
		assert.equal(lengths.lineoff2pos([0,0]),0);
		assert.equal(lengths.lineoff2pos([0,1]),1);
		assert.equal(lengths.lineoff2pos([0,2]),1); //length <2
		assert.equal(lengths.lineoff2pos([1,0]),2);
		assert.equal(lengths.lineoff2pos([999,0]),1998);
		assert.equal(lengths.lineoff2pos([1000,0]),-1); //exceed
	});
	/*
	it("bidirectional",function(){
		var lengths=createsamelength(2);
		for (var i=0;i<100;i++) {
			var p=Math.floor((Math.random()*1999));
			assert.equal( lengths.lineoff2pos(lengths.pos2lineoff(p)) ,p);
		}
	});
 	*/
	it("insert",function(){
		var lengths=createsamelength(2);
		var newlength=lengths.insert(0,3);
		assert.equal(newlength,2000+3);
		
		assert.deepEqual(lengths._ACC(),[ 515, 1027, 1539, 2003 ]);
		assert.equal(lengths.get(0),5);

		assert.deepEqual(lengths.pos2lineoff(4),[0,4]);
		assert.deepEqual(lengths.pos2lineoff(5),[1,0]);

		newlength=lengths.insert(515,3);
		assert.equal(newlength,2003+3);
		assert.deepEqual(lengths._ACC(),[ 515, 1030, 1542, 2006 ]);
	});
	
	it("remove",function(){
		var lengths=createsamelength(2);
		var newlength=lengths.remove(0,2);
		assert.equal(newlength,2000-2);
		assert.equal(lengths.get(0),0);		

		newlength=lengths.remove(0,2);
		assert.equal(newlength,2000-2); //nothing happen

		newlength=lengths.remove(3,2);
		assert.equal(newlength,2000-3); //nothing happen

	});

});