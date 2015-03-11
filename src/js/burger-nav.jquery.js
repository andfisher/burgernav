/**
 * @desc Burger Nav for jQuery. A flexible responsive navigation for mobile touch devices.
 * @author Andrew Fisher
 * @copyright Copyright (c) 2015 Andrew Fisher (andfisher)
 * @version 0.0.2
 * @license The MIT License (MIT)
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

;(function($) {
	'use strict';
	
	$.fn.burgerNav = function(opts) {
	
		var _defaults = {
			main: 'body',
			maxWidth: 720,
			drawerWidth: 200,
			poll: 50,
			onReady: $.noop,
			onOpen: $.noop,
			onClose: $.noop
		},
			_mask,
			_toggle,
			_drawer,
			_isOpen = false;
		
		$.extend(true, _defaults, opts);
		
		var _methods = {
			_debounce: function(fn, wait, immediate) {
				var _timeout;
				return function() {
					var context = this, args = arguments,
						later = function() {
							_timeout = null;
							if (!immediate) fn.apply(context, args);
						};
					var callNow = immediate && !_timeout;
					clearTimeout(_timeout);
					_timeout = setTimeout(later, wait);
					if (callNow) func.apply(context, args);
				};
			},
			_getMask: function() {
				if (! _mask) {
					_mask = $('<div class="burgernav-mask" />');
					$('body').append(_mask);
				}
				return _mask;
			},
			_getDrawer: function() {
				if (! _drawer) {
					_drawer = $('<div class="burgernav-drawer" />').css({
						width: _defaults.drawerWidth,
						left: '-' + _defaults.drawerWidth
					});
					$('body').append(_drawer);
				}
				return _drawer;
			},
			_ready: function() {
				$('body').addClass('with-burgernav');
			},
			open: function() {
				$('body').addClass('open-burgernav');

				$(_defaults.main).add(_toggle).css({
					marginLeft: _defaults.drawerWidth,
					marginRight: '-' + _defaults.drawerWidth
				});
				_drawer.css('left', 0);
				_isOpen = true;
				_defaults.onOpen.call(this);
			},
			close: function() {
				$('body').removeClass('open-burgernav').addClass('animating-burgernav');
				$(_defaults.main).add(_toggle).css({
					marginLeft: 0,
					marginRight: 0
				});
				_drawer.css('left', '-' + _defaults.drawerWidth);
				_mask
					.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
						$('body').removeClass('animating-burgernav');
					});
				_isOpen = false;
				_defaults.onClose.call(this);
			}
		};
		
		_toggle = $('<a class="toggle-burgernav"></a>');
		$('body').append(_toggle).on('click', '.toggle-burgernav, .burgernav-mask', function() {
			$(document).trigger('burgerNav.' + (_isOpen ? 'close' : 'open'));
		});
		_methods._getMask();
		_methods._getDrawer()
		
		// Debounce resize		
		$(window).resize(_methods._debounce(function() {
			$('body')[($(this).width() > _defaults.maxWidth ? 'addClass' : 'removeClass')]('burgernav-disabled');
		}, _defaults.poll));

		return this.each(function() {
		
			$(document).on('burgerNav.open', function(e) {
				_methods.open.call(this);
			}).on('burgerNav.close', function(e) {
				_methods.close.call(this);
			});
			
			_drawer.append($(this).clone());
			$(this).addClass('burgernav-original');
			
			_methods._ready.call(this);
			_defaults.onReady.call(this);
		});
	};
})(jQuery);