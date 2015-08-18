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
	var builddata=function(data) {
		obj.arr=data.split(/\r?\n/);
		obj.text=obj.arr.join("");
		obj.lengths=[],len=0;
		for (var i=0;i<obj.arr.length;i++) {
			obj.lengths.push(len);
			len+=obj.arr[i].length;
		}
		obj.lengths.push(len);
		obj.length=len;
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

		obj.arr[line]=text.substr(0,pos)+str+text.substr(pos);
		obj.lengths[lo[0]+1]+=str.length;

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
	var obj={data:"",arr:[],length:0,lengths:[]
		,insert:insert
		//,replace:replace
		,lineoff2pos:lineoff2pos
		,pos2lineoff:pos2lineoff
		,find:find
	};

	builddata(data);

	return obj;
}
module.exports=Linebreak;