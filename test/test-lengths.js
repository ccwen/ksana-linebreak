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
		assert.equal(lo,null)
	});

	it("lineoff2pos",function(){
		var lengths=createsamelength(2);

		assert.equal(lengths.lineoff2pos([0,0]),0);
		assert.equal(lengths.lineoff2pos([0,1]),1);
		assert.equal(lengths.lineoff2pos([1,0]),2);
		assert.equal(lengths.lineoff2pos([999,0]),1998);
		assert.equal(lengths.lineoff2pos([1000,0]),-1); //exceed
	});
	
});