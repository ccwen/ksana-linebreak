/*
	replace text files with linebreak as if it is a single line text.
*/
var Lengths=require("./lengths");
var Linebreak=function(data,opts) {

	var builddata=function(data) {
		var arr=data.split(/\r?\n/);
		obj.lengths=new Lengths();
		obj.text=arr.join("");
		for (var i=0;i<arr.length;i++) {
			obj.lengths.add(arr[i].length);
		}
		obj.lengths.build();
		obj.length=obj.lengths.getLength();
	}

	var lineoff2pos=function(lineoff) {
		return obj.lengths.lineoff2pos(lineoff);
	}

	var pos2lineoff=function(pos) {
		return obj.lengths.pos2lineoff(pos);
	}

	var getArray=function() {
		var arr=[],at=0;
		for (var i=0;i<obj.lengths.count();i++) {
			var len=obj.lengths.get(i);
			arr.push(obj.text.substr(at,len));
			at+=len;
		}
		return arr;

	}
	var insert=function(pos,str) {
		var lo=pos2lineoff(pos);
		if (!lo) return;
		obj.lengths.insert(pos,str.length);
		obj.text=obj.text.substr(0,pos)+str+obj.text.substr(pos);
	}

	var remove=function(pos,len) {
		var lo=pos2lineoff(pos);
		if (!lo) return;

		obj.lengths.remove(pos,len);
		obj.text=obj.text.substr(0,pos)+obj.text.substr(pos+len);
	}

	var find=function(pat , start) {
		if (typeof pat=="string") {
			return obj.text.indexOf(pat,start);
		} else {
			var sub=obj.text.substr(start||0);	
			var i=sub.search(pat);
			if (start&& i>-1) i+=start;
			return i;
		}

	}
/*
	var test=function() {
		for (var i=0;i<41;i++) {
			var idx=indexOfSorted(obj.lengths,i+1,true);
			console.log(i,"line",idx-1,"offset",i-obj.lengths[idx-1]);
		}
	}
*/
	var obj={data:""
	  ,lengths:null
		,find:find
		,pos2lineoff:pos2lineoff
		,lineoff2pos:lineoff2pos
		,insert:insert
		,remove:remove
		,getArray:getArray
	};

	builddata(data);

	return obj;
}
module.exports=Linebreak;