// ==UserScript==
// @id             iitc-plugin-highlight-red-portals@abeerslayer
// @name           IITC plugin: highlight Red Portals
// @category       Highlighter
// @version        0.0.0.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://static.iitc.me/build/release/plugins/portal-highlighter-portals-my-level.meta.js
// @downloadURL    https://static.iitc.me/build/release/plugins/portal-highlighter-portals-my-level.user.js
// @description    [iitc-2017-01-08-021732] Use the portal fill color to denote if the portal is either at and above, or at and below your level.
// @match          https://*.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'iitc';
plugin_info.dateTimeVersion = '20221113.000000';
plugin_info.pluginId = 'portal-highlighter-portals-my-level';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.redPortalHighLight = function() {};


window.plugin.redPortalHighLight.red = function(data) {

    if( data.portal.options.data.team == 'M' ){
        data.portal.setStyle({fillColor: '#FF0000', fillOpacity: 1.0});
    }

}

var setup = function() {
  window.addPortalHighlighter('Red Portals', window.plugin.redPortalHighLight.red);
}

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
