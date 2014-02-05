// ==UserScript==
// @id             disable-portal@asnapper
// @name           IITC plugin: Disable Portal
// @category       Tweaks
// @version        0.0.1.@@DATETIMEVERSION@@
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Allows you disable specific portals for plugins like fly-links
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

@@PLUGINSTART@@

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.disablePortal = function() {};

// array to hold all disabled portal GUIDs
window.plugin.disablePortal.disabledGUID = [];

window.plugin.disablePortal.disable = function(guid) {
	window.plugin.disablePortal.disabledGUID[guid] = true;
	window.plugin.disablePortal.addControl({guid:guid});
	//if (window.plugin.flyLinks)
	//	window.plugin.flyLinks.updateLayer();
	window.runHooks('mapDataRefreshEnd');
};

window.plugin.disablePortal.enable = function(guid) {
	delete window.plugin.disablePortal.disabledGUID[guid];
	window.plugin.disablePortal.addControl({guid:guid});
	//if (window.plugin.flyLinks)
	//	window.plugin.flyLinks.updateLayer();
	window.runHooks('mapDataRefreshEnd');
};

window.plugin.disablePortal.addControl = function(data) {
	// delete html control
	var node = document.getElementById('disablePortal');
	if (node) {
		node.parentNode.removeChild(node);
	}
	
	// build onClick attribute strings
	var onClickEnable = 'window.plugin.disablePortal.enable(\'' + data.guid+ '\')';
	var onClickDisable = 'window.plugin.disablePortal.disable(\'' + data.guid+ '\')';
	
	// (re-)create html control
	var element;
	if (data.guid in window.plugin.disablePortal.disabledGUID) {
		element = $('<div>').html( $('<a>').attr({onclick:onClickEnable, title:'Enable'}).text('Enable') );
	} else {
		element = $('<div>').html( $('<a>').attr({onclick:onClickDisable, title:'Disable'}).text('Disable') );
	}
	//element.attr({id:'disablePortal'});
	
	// find location to insert
	// DEBUG: verify XPath query!!
	var htmlParent = document.evaluate('//*[@id="portaldetails"]/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	
	// insert (probably ugly...)
	if (htmlParent)
		htmlParent.innerHTML += '<aside id="disablePortal">' + element.html() + '</aside>';
};

window.plugin.disablePortal.updateControl = function(guid) {
	//var data.guid = guid;
	//window.plugin.disablePortal.addControl(data);
};

window.addHook('portalDetailsUpdated', window.plugin.disablePortal.addControl);

var setup = function() {};

// PLUGIN END //////////////////////////////////////////////////////////

@@PLUGINEND@@