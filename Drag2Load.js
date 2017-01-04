/**
 * 下拉或上拉加载插件 base on Zepto or jquery
 */

;(function($){

function Drag2Load(opt) {
	this.$window = $(window);
	this.docHeight = $(document.body).height();
	this.curPos = 0;
	this.start;
	this.state = 0;
	this.topBoundaryHookDone = false;
	this.btmBoundaryHookDone = false;
	this.init(opt);
}

var fn = {
	constructor: Drag2Load,
	init: function (opt){
		for(var k in opt){
			this[k] = opt[k];
		}
		this.bindEvent();
	},
	bindEvent: function(){
		var that = this;
		this.$content.on('touchstart', function(e){
			that.start = e.touches[0].clientY;
		}).on('touchmove', function(e){
			var y = e.touches[0].clientY,
				offset = Math.abs(y - that.start),
				pos = Math.pow(offset*7, 1/2);
			if(that.$window.scrollTop() == 0) {
				that.dragTop(pos);
			}else if(that.$window.scrollTop() + that.$window.height() == that.docHeight) {
				that.dragBtm(pos);
			}
		}).on('touchend', function(e){
			if(that.shouldReset){
				that.reset();
				that.shouldReset = 0;
			}
		});
	},
	dragTop: function(pos){
		this.shouldReset = 1;
		this.$toploading.add(this.$content).css({
			'transition': '',
			'transform': 'translateY(' + pos + 'px)'
		});
		if(pos > this.topBoundary && !this.topBoundaryHookDone){
			this.state = 1;
			this.topBoundaryHook(this);
			this.topBoundaryHookDone = true;
		}

	},
	dragBtm: function(pos){
		this.shouldReset = 1;
		this.$btmloading.add(this.$content).css({
			'transition': '',
			'transform': 'translateY(' + -pos + 'px)'
		});
		if(pos > this.topBoundary && !this.btmBoundaryHookDone){
			this.state = 2;
			this.btmBoundaryHook(this);
			this.btmBoundaryHookDone = true;
		}
	},

	reset: function(state){
		if(typeof state == 'number' && state >= 0 && state <=2) this.state = state;
		var pos, $obj, cb;
		switch(this.state){
			case 0:
				pos = 0;
				$obj = this.$toploading.add(this.$btmloading).add(this.$content);
				break;
			case 1:
				pos = this.topBoundary;
				$obj = this.$toploading.add(this.$content);
				cb = this.topResetHook;
				break;
			case 2:
				pos = -this.btmBoundary;
				$obj = this.$btmloading.add(this.$content);
				cb = this.btmResetHook;
				break;
			default: ;
		}

		$obj.css({
			'transition': 'all 0.5s ease',
			'transform': 'translateY(' + pos + 'px)'
		});
		this.topBoundaryHookDone = this.btmBoundaryHookDone = false;
		this.state = 0;
		typeof cb == 'function' && cb(this);
	}
}

Drag2Load.prototype = fn;

$.fn.drag2Load = function (opt) {
	var params = $.extend(opt, {$content: $(this)});
	return new Drag2Load(params); 
}

})(window.Zepto || window.Jquery);
