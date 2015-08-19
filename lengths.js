/*
  Fast random access and writable sorted array of integers.

  the problem:

  lines     length   accumulated length
  =====     ======   ==================
  12         2       2
  123        3       5
  1234       4       9

  //combine line
  121231234

  1) when text line get changed, length array can ge easily updated.
  2) binary search accumulated length to get the #line given absolute position of combine line.
  3) update of acculated length is costly

  lines     length   accumulated length in batch
  =====     ======   ==================
  12         2       xxxxx
  123        3       
  1234       4       
  ......254 entries....
  1234       5       xxxxx

	Design:
  1) once created , the total number of line will not be changed.
  2) only store accumulated length for every 256 lines.
     for 1 million lines, each update will cause maximum 4096 updates.
  
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

var Lengths=function() {
	var L=[]  //item length
	, ACC=[]; //accumulated length

	var add=function(n){
		L.push(n);
	}
	var build=function() {
		var accumulated=0;
		ACC=[];
		for (var i=0;i<L.length;i++) {
			if (i%256==0 && i) {
				ACC.push(accumulated);
			}
			accumulated+=L[i];
		}
		ACC.push(accumulated);
	}
	var pos2lineoff=function(pos) {
		var idx=indexOfSorted(ACC,pos,true);
		var startfrom=0;
		if (idx>0)  {
			startfrom=ACC[idx-1];
		}
		var dist=pos-startfrom;
		var line=idx*256;
		while (dist>0) {
			line++;
			dist-=L[line];
			if (dist<0) {
				dist+=L[line];
				line--;
				break;
			}
		}
		if (line>=L.length)return null;
		return [line,dist];
	}

	var lineoff2pos=function(lo) {
		var acc=Math.floor(lo[0]/256);
		var line=acc*256;
		var remain=lo[0]%256;
		var pos=0;
		if (acc>0) {
			pos=ACC[acc-1];
		}
		while (remain) {
			pos+=L[line++];
			remain--;
		}
		pos+=lo[1];
		if (pos>=ACC[ACC.length-1]) return -1;
		return pos;
	}
	this._ACC=function(){return ACC};
	this.add=add;
	this.build=build;
	this.pos2lineoff=pos2lineoff;
	this.lineoff2pos=lineoff2pos;
	return this;
}
module.exports=Lengths;