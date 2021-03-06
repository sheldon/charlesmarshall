(function($) {

	$.fn.scroller=function(options){
		return this.each(function(){			
			if(this._scroller) return;
			var params = $.extend({}, $.fn.scroller.defaults, options);
			this._scroller = true;
			if(jQ(this).find(params['controller']).length){
				var target = this;
				current_page = params['start'];
				jQ(this).find(params['item']).each(function(){
					counter++;
					H[counter] = {item:this,params:params,target:target,pos:counter};
					jQ(this).addClass('is_item_'+counter).css('position','relative').css('top','-'+av_height+'px').css('left',av_width+'px');
					av_width+=jQ(this).outerWidth();
					av_height+=jQ(this).outerHeight();
					if(jQ(this).outerHeight() > max_h) max_h = jQ(this).outerHeight();
				});
				av_width=av_width/counter;
				av_height=av_height/counter;
				jQ(params['container']).css('width', (av_width*params['visible'])+'px').css('height', (max_h)+'px').css('overflow','hidden');
				if(params['start'] != 1) $.scroller.moveto(params['start']);
				jQ(params['controller']).find('a').click(function(){
					if(jQ(this).parent().hasClass('disabled')) return false;
					else $.scroller.moveto(parseInt(jQ(this).attr('href').replace('#item_','')));
					return false;
				});
				if(params['auto'] && typeof(params['auto'])=="number") setTimeout("$.scroller.moveto("+(current_page+1)+");", params['auto']);
			}else{
				alert('No controller found! ->'+jQ(this).id);
			}
		});
	};
	
	$.fn.scroll_to=function(item_number){
		return $.scroller.moveto(item_number);
	}
	
	$.scroller = {
		hash:{},
		moveto:function(item_number){
			clearTimeout(timed);
			current_page = item_number;
			if(typeof(H[item_number]) == "undefined") return;
			var sp = H[item_number];
			if(sp.params['before']) eval(sp.params['before']);
			for(i in H){
				var h = H[i];
				if(h.pos < item_number) jQ(h.item).animate({'left': "-"+(av_width*(item_number-h.pos))+'px'},h.params['speed']); 
				else if(h.pos == item_number)	jQ(h.item).animate({'left': '0px'},h.params['speed'], function(){eval(h.params['after']);});
				else jQ(h.item).animate({'left': (av_width*(h.pos-item_number))+'px'},h.params['speed']);
			}	//end for	
			jQ(h.target).find('li').removeClass('disabled');
			if(item_number > 1)	jQ(h.target).find('li.previous a').attr('href', '#item_'+(item_number-1));
			else jQ(h.target).find('li.previous').addClass('disabled');
			if(item_number < counter)	jQ(h.target).find('li.next a').attr('href', '#item_'+(item_number+1));
			else jQ(h.target).find('li.next').addClass('disabled');
			if(sp.params['auto'] && typeof(sp.params['auto'])=="number") timed = setTimeout("$.scroller.moveto("+(current_page+1)+");", sp.params['auto']);
		}//end move to
		
	};
	$.fn.scroller.defaults = {start:1, speed:'slow', visible:1,container:'#container', controller:'#controls', item:'.item', before:false, after:false,auto:false};
	
	var jQ=jQuery,timed,current_page=0;av_width=0,av_height=0,max_h=0,counter=0,H=$.scroller.hash,ie6=$.browser.msie&&($.browser.version == "6.0");
	
})(jQuery);