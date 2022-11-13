// ==UserScript==
// @author         ABeerSlayer
// @name           IITC plugin: Highlight Red portals
// @description    Highlight red portals
// @category       Highlighter
// @version        0.0.1
// @id             highlight-red-portals
// @match          https://*.ingress.com/*
// @match          http://*.ingress.com/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @include        https://*.ingress.com/*
// @include        http://*.ingress.com/*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @grant          none
// @namespace 
// ==/UserScript==

function wrapper(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'ABeerSlayer@highlight-red-portals';
    plugin_info.dateTimeVersion = '2021-02-08-220302';
    plugin_info.pluginId = 'highlight-red-portals';

    function highlight(data, flag) {    
            data.portal.setStyle({fillColor: '#ff0000', fillOpacity: 0.75});
    }

    var e = {};

    e.highlightRedPortals = function(data) {
        //highlight(data, CAPTURED);
    }

    e.handlePortalSelect = function(data) {
        setTimeout(function() {
            highlightPortal(data.portal);
        },0);
    }

    window.plugin.highlightPortals = e;

    function setup() {
        window.addPortalHighlighter('Red', window.plugin.highlightPortals.highlightRedPortals);

        window.addHook('portalDetailsUpdated', window.plugin.highlightPortals.handlePortalSelect);
    }

    setup.info = plugin_info;

    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};

if(typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version,
        name: GM_info.script.name,
        description: GM_info.script.description
    };
}

var textContent = document.createTextNode('('+ wrapper +')('+ JSON.stringify(info) +')');
script.appendChild(textContent);
(document.body || document.head || document.documentElement).appendChild(script);