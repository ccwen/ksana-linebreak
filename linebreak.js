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


	var updatelength=function(pos,from,to) {
		var start=pos2lineoff(pos);
		var end=pos2lineoff(pos+from.length);
		if (start[0]==end[0]){ //same line
			if (from.length>to.length) {
				obj.lengths.remove(pos,from.length-to.length);	
			} else if (to.length>from.length){
				obj.lengths.insert(pos,to.length-from.length);
			}
		} else {
			if (from.length>to.length) {//reduce length
				//console.log(obj.lengths.getL());
				var remain=from.length-to.length;
				var startdelete=pos2lineoff(pos+to.length);

				for (var i=end[0];i>=startdelete[0];i--) {
					var len=obj.lengths.get(i);
					if (i===end[0]) {
						remain-=obj.lengths.removeLine(i,end[1]);
					} else {
						remain-=obj.lengths.removeLine(i,remain);
					}
				}
				//console.log(obj.lengths.getL());
			} else if (from.length<to.length) { //increase length
				obj.lengths.insert(pos+from.length, to.length-from.length);
			}
		}
	}
	var replace=function(reg,cb) {
		var replaces=[];
		if (reg.constructor!==RegExp) reg=new RegExp(reg,"g");

		obj.text=obj.text.replace(reg,function(m1){
			var o=cb.apply(obj.text,arguments);
			var idx=arguments[arguments.length-2];
			replaces.push([idx,m1,o]); // pos, from, to
			return o;
		});
		for (var i=0;i<replaces.length;i++) {
			var idx=replaces.length-1-i;//start from bottom
			var pos=replaces[idx][0],from=replaces[idx][1],to=replaces[idx][2];
			updatelength(pos,from,to);
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
		,replace:replace
	};

	builddata(data);

	return obj;
}
module.exports=Linebreak;