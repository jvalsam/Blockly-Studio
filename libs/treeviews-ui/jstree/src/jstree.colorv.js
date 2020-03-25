/**
 * ### Color Vector plugin
 *
 * This plugin renders color vector icons in front of each node.
 * It also supports editing color rename action.
 */
/*globals jQuery, define, exports, require, document */
(function (factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define('jstree.colorv', ['jquery','jstree'], factory);
	}
	else if(typeof exports === 'object') {
		factory(require('jquery'), require('jstree'));
	}
	else {
		factory(jQuery, jQuery.jstree);
	}
}(function ($, jstree, undefined) {
	"use strict";

    if($.jstree.plugins.colorv) { return; }

    var _span = document.createElement('SPAN');
	_span.style.cssText = "border-right-width: 6px; height: 1em; width: 6px; margin-left: 2px; padding-left: 2px; border-left: 6px solid white;";
	_span.setAttribute('role', 'presentation');

	var cacheColor = false;
	var cacheColorNodes = function (self) {
		function cacheColorNodesRec(self, data) {
			var i, j;
			for(i = 0, j = data.length; i < j; i++) {
				var node = data[i];
				self._model.data[node.id].color = node.color;
				if (node.children) {
					cacheColorNodesRec(self, node.children);
				}
			}
		}

		if (!cacheColor) {
			cacheColor = true;
			cacheColorNodesRec(self, self.settings.core.data);
		}
	};

    $.jstree.plugins.colorv = function (options, parent) {
        // draw editing to add extra icon
        this.redraw_node = function(obj, deep, callback, force_render) {
			cacheColorNodes(this);

			obj = parent.redraw_node.apply(this, arguments);
			if(obj) {
				var i, j, tmp = null, spanElem = null;
				for(i = 0, j = obj.childNodes.length; i < j; i++) {
					if(obj.childNodes[i] && obj.childNodes[i].className && obj.childNodes[i].className.indexOf("jstree-anchor") !== -1) {
						tmp = obj.childNodes[i];
						break;
					}
				}
				
				if(tmp) {
					var color = this._model.data[obj.id].color;
					if(color) {
                        spanElem = _span.cloneNode(false);
						spanElem.style.borderLeftColor = color;
						if (tmp.nodeName === 'A') {
							tmp.insertBefore(spanElem, tmp.childNodes[0]);
						}
						else {
							tmp.after(spanElem, tmp.childNodes[0]);
						}
                    }
				}
			}
			return obj;
		};
    };
}));