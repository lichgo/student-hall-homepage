var BY = new function() {
	var _doc = document,
		_bd = _doc.body,
		_ua = navigator.userAgent,
		_idRange = {'from':1, 'to':10},
		_memo = [],
		_memoUrl = '/memos.json',
		_picBaseUrl = './images/',
		_isIE = _ua.indexOf('MSIE') >= 0 ? true : false,
		_fjs = _tag('script')[0];

		function _getMemo(url) {
			//to parse a json file
			//var jsonObj = todo(_idRange);
			var jsonObj = [
				'We are thunder birds!',
				'Boyan High Table Dinner 2012',
				'Prof. Han is copied?!',
				'Our advisors',
				'Fruit gathering',
				'International scholars',
				'Being a MC',
				'Sharing experience from enterprise',
				'Tug-of-war 2013'

			];
			for (key in jsonObj)
				_memo.push(jsonObj[key]);
		}

		function _serializeObjPara(obj) {
			if (_getType(obj) != 'object') return '';
			var str = '';
			for (key in obj)
				str += key + '=' + obj[key] + '&';
			return str;
		}

		function _getType(para) {
			var _t;
			return ((_t = typeof para) == 'object' ? para == null && 'null' || Object.prototype.toString.call(para).slice(8, -1) : _t).toLowerCase();
		}

		function _id(strId) {
			return _doc.getElementById(strId);
		}

		function _tag(tagName, context) {
			return (context || _doc).getElementsByTagName(tagName);
		}

		function _loadScript(id, url) {
			if (!id || !url || _id(id)) return;
			var js = _doc.createElement('script');
			js.type = 'text/javascript';
			js.id = id;
			js.src = url;
			_fjs.parentNode.insertBefore(js, _fjs);
		}

		function _typeChecking(arrTypes, arrParas) {
			if (_getType(arrTypes) != 'array' || _getType(arrParas) != 'array') return false;
			for (var i = 0, len = arrTypes.length; i < len; i++) {
				if (_getType(arrParas[i]) != arrTypes[i]) return false;
			}
			return true;
		};

		function $(ele) {
			return new E(ele);
		}
		function E(ele) {
			this.ele = ele;
		}
		E.prototype.addEvent = function(type, handler) {
			var ele = this.ele;

			if (!handler.$$id) handler.$$id = E.handlerId++;

			if (!ele.events) ele.events = {};
			var handlers = ele.events[type];
			if (!handlers) {
				handlers = ele.events[type] = {};

				if (ele['on' + type]) {
					handlers[0] = ele['on' + type];
				}
			}

			handlers[handler.$$id] = handler;
			ele['on' + type] = executeHandlers;

			return this;
		};

		function ajax(obj) {
			obj = {
				type: obj.type || 'POST',
				url: obj.url || '',
				onComplete: obj.onComplete || function() {},
				onSuccess: obj.onSuccess || function() {},
				dataType: obj.dataType || 'xml'
			}

			if (typeof XMLHttpRequest == 'undefined') {
				XMLHttpRequest = function() {
					return new ActiveXObject(
						_ua.indexOf('MSIE 5') >= 0 ? 'Microsoft.XMLHTTP' : 'Msxml2.XMLHTTP'
					);
				}
			}

			var xhr = new XMLHttpRequest();
			if (obj.type == 'POST') {
				xhr.setRequestHeader('Contype-Type', 'text/html');
				if (xhr.overrideMimeType)
					xhr.setRequestHeader('Connection', 'close');
			}
			xhr.open(obj.type, obj.url, true);

			var timeoutLen = 5000;
			var requestDelay = false;
			setTimeout(function() {
				requestDelay = true;
			}, timeoutLen);

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && !requestDelay) {
					if (httpSuccess(xhr))
						obj.onSuccess(httpData(xhr, obj.dataType));
					else
						console.log('ajax error occurs');

					obj.onComplete();
					xhr = null;
				}
			};

			xhr.send();

			function httpSuccess(x) {
				try {
					return  !x.status && location.protocol == 'file:' ||
							x.status >= 200 && x.status < 300 ||
							x.status == 304 ||
							_ua.indexOf('Safari') >= 0 && typeof x.status == 'undefined';
				} catch (e) {}

				return false;
			}

			function httpData(x, dataType) {
				var ct = x.getResponseHeader('Content-Type');
				var isXML = (!dataType && ct && ct.indexOf('xml') >= 0) || (dataType && dataType == 'xml');
				var returnType = isXML ? 'responseXML' : 'responseText';

				if (dataType == 'script')
					eval.call(window, x[returnType]);

				return x[returnType];
			}
		}

		function executeHandlers(event) {
			var returnValue = true;

			event = event || fixEvent(window.event);
			var handlers = this.events[event.type];
			for (var keyName in handlers) {
				if (handlers[keyName](event) === false)
					returnValue = false;
			}

			return returnValue;
		}

		function fixEvent(event) {
			event.stopPropagation = fixEvent.stopPropagation;
			event.preventDefault = fixEvent.preventDefault;
			return event;
		}

		fixEvent.stopPropagation = function() {
			this.cancelBubble = true;
		}
		fixEvent.preventDefault = function() {
			this.returnValue = false;
		}

		E.handlerId = 1;

	//init the webpage
	//dropdown menu
	var followUs = _id('followUs'),
		ddMenu = _tag('ul', followUs)[0];
	$(followUs).addEvent('click', function(e) {
		followUs.className = 'focus';
		e.stopPropagation();
	});
	$(_bd).addEvent('click',function(e) {
		followUs.className = '';
	});

	//config
	this.config = function(idRangeFrom, idRangeTo) {
		if(!_typeChecking(['number', 'number'], [idRangeFrom, idRangeTo])) return;
		_idRange.from = idRangeFrom;
		_idRange.to = idRangeTo;
		_getMemo(_memoUrl + '?' + _serializeObjPara(_idRange));

		return this;
	};

	//twitter
	this.twitter = function(opt) {
		if (!opt) return;
		//get tweets from url
		_loadScript('loadTweet', 'http://xoyo.name:8080/tweet/find?callback=BY.renderTweets');
		return this;
	};

	this.renderTweets = function(tweets) {
		var container = _id('twitter'),
			html = '';

		for (var pos in tweets) {
			with (tweets[pos]) {
				html += '<li class="tweet"><a href="./news/index.htm?_id=' + _id + '">' + title + '</a><span class="date">' + (new Date(datetime)).toLocaleDateString() + '</span></li>';
			}
		}

		container.innerHTML = html;

		return this;
	};

	//slideshow module (a class)
	this.slideShow = function(obj) {
		//obj includes the paras
		//html: ul > li > img, span
		var content = _id('slides');
		//initialize the li elements
		var htmlLi = '', i = _idRange.from, counter = 0;
		while (i <= _idRange.to) {
			htmlLi += '<li class="slideItem" data="' + _memo[counter] + '"><img src="' + _picBaseUrl + (i++) + '.jpg" /><span>' + _memo[counter++] + '</span></li>'
		}
		content.innerHTML = htmlLi;
		var timer;

		return {
			'clickToShow': function() {
				console.log('clicktoshow: ' + _doc);
				var lis = _tag('li', content);
				var wrapper = _doc.createElement('div');
				wrapper.id = 'wrapper';
				var overlay = _doc.createElement('div');
				overlay.id = 'overlay';
				var container = _doc.createElement('div');
				container.id = 'container';

				wrapper.appendChild(overlay);
				wrapper.appendChild(container);
				_doc.body.appendChild(wrapper);

				$(wrapper).addEvent('click', function(e) {
					wrapper.setAttribute('style', 'display:none;');
				});

				function showContent(e) {
					var li = e.target.parentNode;
					container.innerHTML = li.innerHTML;
					wrapper.setAttribute('style', 'display:block;');
				}

				for (var i = 0, len = lis.length; i < len; i++) {
					$(lis[i]).addEvent('click', showContent);
				}

				return this;
			},
			'start': function() {
				var list = _tag('li', content), index = 2, len = list.length;
				list[index - 1].setAttribute('style', 'left: 0px;');
				setTimeout(function() {content.className = 'moving';}, 2000);
				timer = setInterval(function() {
					list[(index - 2) % len].setAttribute('style', 'left: 960px;');
					list[(index - 1) % len].setAttribute('style', '-ms-transform:translate(-1920px, 0); -o-transform:translate(-1920px, 0); -moz-transform:translate(-1920px, 0); -webkit-transform:translate(-1920px, 0);');
					list[index % len].setAttribute('style', '-ms-transform:translate(-960px, 0); -o-transform:translate(-960px, 0); -moz-transform:translate(-960px, 0); -webkit-transform:translate(-960px, 0);');
					index++;
				}, 2500);

				//fixIE
				if (_isIE) content.innerHTML = '<img src="' + _picBaseUrl + '/1.jpg" />';

				return this;
			}
		}
	};

	this.loadYouTube = function(url, autoStart) {
		if (!url) return this;
		autoStart = autoStart === undefined ? true : autoStart;

		var script = _doc.createElement('script');
		script.src = 'http://www.youtube.com/iframe_api';
		var firstScriptTag = _tag('script', document)[0];
		firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

		//get playlist
		ajax({
			type: 'GET',
			url: url,
			onComplete: null, //play the first vedio
			onSuccess: renderResult,
			dataType: 'json'
		});

		function renderResult(data) {
			var entries = eval('(' + data + ')').feed.entry,
				vIdList = [],
				htmlContent = '<ul class="list">';
			for (var i = 0, len = entries.length; i < len; i++) {
				var url = entries[i].link[0].href;
				vIdList.push(url.substring(32, url.indexOf('&feature')));
				htmlContent += '<li id="ytItem' + i + '"><a href="' + url + '">' + entries[i].title.$t + '</a></li>';
			}
			htmlContent += '</ul>';

			var list = _id('youtubeList');
			list.innerHTML = htmlContent;
			var links = _tag('a', list),
				index = 0;
			for (var i = 0, len = links.length; i < len; i++) {
				(function() {
					var v_id = vIdList[i];
					var temp = i;
					$(links[i]).addEvent('click', function(e) {
						ytplayer.loadVideoById(v_id);
						index = temp;
						e.preventDefault();
					});
				})();
			}

			var ytplayer;
			setTimeout(function() {
				ytplayer = new YT.Player('ytplayer', {
					width: 440,
					height: 247,
					videoId: vIdList[index],
					events: {
						onReady: function(e) {
							if (autoStart)
								e.target.playVideo();
						},
						onStateChange: function(e) {
							if (e.data == 1) {
								clearPlaying();
								_id('ytItem' + (index % vIdList.length)).className = 'playing';	
							} else if (e.data == 0) {
								ytplayer.loadVideoById(vIdList[(++index) % vIdList.length]);
							}
						}
					}
				});
			}, 2000);

			var lis = _tag('li', list)
			function clearPlaying() {
				for (var i = 0, len = lis.length; i < len; i++) {
					lis[i].className = '';
				}
			}
		}

		return this;
	};

	this.loadFb = function() {
		_loadScript('facebook-jssdk', 'http://connect.facebook.net/en_US/all.js#xfbml=1');
		return this;
	}
};
