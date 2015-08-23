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

var Lengths=function() {
	var L=[]     //item length
	, ACC=[]     //accumulated length
  , length=0;  //total length

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
		length=accumulated;
	}

  var accofpos=function(pos) {
		for (var i=0;i<ACC.length;i++) {
			if (ACC[i]>pos) {
				return i;
			}
		}
		return -1;
  }

	var pos2lineoff=function(pos) {
		var idx=accofpos(pos);
		if (idx<0) return null;
		var startfrom=0;
		if (idx>0)  {
			startfrom=ACC[idx-1];
		}

		var dist=pos-startfrom;
		var line=idx*256;

		while (dist>0) {
			if (dist>=L[line]) {
				dist-=L[line];
				line++;	
			} else break;
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
		var off=lo[1];
		if (off>=L[line]) off=L[line]-1;
		pos+=off;
		if (pos>=ACC[ACC.length-1]) return -1;
		return pos;
	}


	var insert=function(pos,sz){
		var lo=pos2lineoff(pos);
		if (!lo) return null;

		L[lo[0]]+=sz;

		var acc=Math.floor(lo[0]/256);
		for (var i=acc;i<ACC.length;i++) {
			ACC[i]+=sz;
		}

		length+=sz;
		return length;
	}

	var remove=function(pos,sz){
		var lo=pos2lineoff(pos);
		if (!lo) return null;

		var left=L[lo[0]]-lo[1];
		if (sz>left) sz=left;

		return removeLine(lo[0],sz);
	}

	var removeLine=function(line,sz) {
		var len=L[line];
		if (sz>len) sz=len;

		L[line]-=sz;
		if (L[line]<0) L[line]=0;

		var acc=Math.floor(line/256);
		for (var i=acc;i<ACC.length;i++) {
			ACC[i]-=sz;
		}

		length-=sz;
		return sz;
	}

	this._ACC=function(){return ACC};
	this.add=add;
	this.build=build;
	this.pos2lineoff=pos2lineoff;
	this.lineoff2pos=lineoff2pos;
	this.get=function(idx){return L[idx]};
	this.getL=function(){return L};
	this.getLength=function(){return length}
	this.count=function(){return L.length};
	this.insert=insert;
	this.remove=remove;
	this.removeLine=removeLine;
	return this;
}
module.exports=Lengths;