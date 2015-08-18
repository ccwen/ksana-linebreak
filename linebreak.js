/*
	replace text files with linebreak as if it is a single line text.
*/
var indexOfSorted = function (array, obj, near) { 
  var low = 0, high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low]==obj) return low;else return -1;
};

var Linebreak=function(data,opts) {

	var rebuildtext=function() {
		if (!obj.dirty) return;
		obj.text=obj.arr.join("");
		obj.length=obj.text.length;
		obj.dirty=false;
	}
	var builddata=function(data) {
		obj.arr=data.split(/\r?\n/);
		obj.lengths=[],len=0;
		for (var i=0;i<obj.arr.length;i++) {
			obj.lengths.push(len);
			len+=obj.arr[i].length;
		}
		obj.lengths.push(len);
		obj.dirty=true;
		rebuildtext();
	}

	var lineoff2pos=function(lineoff) {
		var line=lineoff[0], off=lineoff[1];

		if (line<0 || line>=obj.lengths.length-1) return -1;
		var linelen=obj.lengths[line];

		var next=obj.lengths[line+1];
		if (next-linelen-1<off) return -1;
		return linelen+off;
	}

	var pos2lineoff=function(pos) {
		var line=indexOfSorted(obj.lengths,pos+1,true)-1;
		if (line>=obj.lengths.length-1) return null;
		return [ line, pos-obj.lengths[line]];
	}


	var insert=function(pos,str) {
		var lo=pos2lineoff(pos);
		if (!lo) return;
		var line=lo[0],off=lo[1];
		var text=obj.arr[line];

		obj.arr[line]=text.substr(0,off)+str+text.substr(off);
		obj.lengths[lo[0]+1]+=str.length;
		obj.dirty=true;
	}

	var remove=function(pos,len) {
		var lo=pos2lineoff(pos);
		if (!lo) return;
		var line=lo[0],off=lo[1];
		var text=obj.arr[line];

		obj.arr[line]=text.substr(0,off)+text.substr(off+len);
		var reducelength=text.length-obj.arr[line].length;

		obj.lengths[lo[0]+1]-= reducelength;

		obj.dirty=true;
	}

	var find=function(pat , start) {
		rebuildtext();
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
	var obj={data:"",arr:[],length:0,lengths:[]
		//,replace:replace
		,lineoff2pos:lineoff2pos
		,pos2lineoff:pos2lineoff
		,find:find
		,insert:insert
		,remove:remove
	};

	builddata(data);

	return obj;
}
module.exports=Linebreak;