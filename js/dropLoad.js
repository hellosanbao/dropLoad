;(function($,win){
	var defaultOpts={
		listdom:".lists",
		defaultY:100,
		contentH:50,
		topstrcontent:"下拉刷新",
		topcomcontent:"释放刷新页面",
		toploading:"正在刷新",
	}
	var dropLoad=function(el,opts){
		var me=this;
		me.el=$(el);
		me.conf=$.extend(true, defaultOpts, opts||{});
		me.init();
		me.eventFn();
	}
	dropLoad.prototype={
		init:function(){
			var me=this;
			me.isBotLoading=false;
			me.isTopLoading=false;
			me.dom={
				topLoadBox:$('<div class="topLoadBox">'),
				topLoad:$('<div class="topLoad">'),
				botLoadBox:$('<div class="botLoadBox">'),
				botLoad:$('<div class="botLoad">'),
			}
		},
		loadFn:function(){
			var me=this;
			if(me.isLoadTop() && me.movedir=='down' && !me.isBotLoading && !me.isTopLoading){
				me.el.prepend(me.dom.topLoadBox.prepend(me.dom.topLoad))
					me._absm=150*(1-1/(Math.pow(2,me.absm/100)));
				me.dom.topLoadBox.css("height",me._absm+"px")
				me.dom.topLoad.html(me.conf.topstrcontent)
				if(me._absm>=me.conf.contentH){
					me.dom.topLoad.html(me.conf.topcomcontent)
				}
			}	
			if(me.isLoadBot() && me.movedir=='up' && !me.isTopLoading && !me.isBotLoading

				){
				me.el.append(me.dom.botLoadBox.append(me.dom.botLoad))
				me.dom.botLoadBox.css("height","50px")
				me.dom.botLoad.html(me.conf.topstrcontent)
			}
				
		},
		isLoadTop:function(){
			var me=this;
			return ($(window).scrollTop()<=0?true:false)
		},
		isLoadBot:function(){
			var me=this;
			var conH=$('body').height();
			var winH=$(window).height();
			this.scrollHeight=(winH/conH)*winH;
			return (conH-$(window).scrollTop()-50<=winH?true:false)
		},
		removeLoad:function(){
			var me=this;
				me.dom.topLoadBox.remove()
				me.dom.botLoadBox.remove()
				me.isTopLoading=false;
				me.isBotLoading=false;
				me._absm=null;
				
		},
		eventFn:function(){
			var me=this;
			me.el.on('touchstart',function(e){
				me.defY=e.touches[0].pageY;
			}).on('touchmove',function(e){
				fnTouches(e)
				movedir(e,me)
			}).on('touchend',function(e){
				if(me.isLoadTop()){
					if(me._absm>=50){
						if(!me.isTopLoading && !me.isBotLoading){
							me.dom.topLoadBox.css("height","50px")
							me.isTopLoading=true;
							if($.type(me.conf.ajaxTopfn)==='function'){
								setTimeout(function(){
									me.conf.ajaxTopfn(me)
								},500)
							}
						}
					}else{
						me._absm=0;
						me.dom.topLoadBox.css("height","0px")
					}
					me.dom.topLoad.html(me.conf.toploading)
				}
				if(me.isLoadBot() && !me.isTopLoading && !me.isBotLoading){
					me.isBotLoading=true;
					if($.type(me.conf.ajaxBotfn)==='function'){
						setTimeout(function(){
							me.conf.ajaxBotfn(me);
						},500)
					}
				}
			})

			function fnTouches(e){
        		if(!e.touches){
            		e.touches = e.originalEvent.touches;
        		}
    		}

    		function movedir(e,me){
    			me.m=me.defY-e.touches[0].pageY
    			me.movedir=me.m<0?"down":"up";
    			me.absm=Math.abs(me.m)
    			if(me._absm>1 && !me.isTopLoading){
					e.preventDefault();
				}
    			me.loadFn();
    		}
		},
	}
    
	$.fn.dropLoad=function(opts){
		return new dropLoad(this,opts);
	}
})(Zepto,window)