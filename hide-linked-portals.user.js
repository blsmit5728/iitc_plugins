// ==UserScript==
// @author         blsmit5728
// @name           Hide portals that are linked or fielded.
// @category       Highlighter
// @version        0.9
// @description    Hides any portal that has a link or field from it.
// @id             boner-unlinked-highlighter@blsmit5728
// @updateURL      https://github.com/blsmit5728/iitc_plugins/raw/main/hide-linked-portals.user.js
// @downloadURL    https://github.com/blsmit5728/iitc_plugins/raw/main/hide-linked-portals.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // use own namespace for plugin
    window.plugin.bonerunlinked = function() {};

    /**
     * Indicates whether portals are displayed at the current level.  Simply using zoom level
     * does not factor in other tools that adjust display capabilities.
     */
     window.plugin.bonerunlinked.zoomLevelHasPortals = function() {
        return window.getMapZoomTileParameters(window.getDataZoomForMapZoom(window.map.getZoom())).hasPortals;
    };

    window.plugin.bonerunlinked.hideLinked = function(data, conditional) {
        var d = data.portal.options.data;
        var health = d.health;
        var guid = data.portal.options.ent[0];

        if (conditional(guid) == false && window.plugin.bonerunlinked.zoomLevelHasPortals()) {
            // Hide any portal that meets the conditions.
            var style = {};

            style.fillOpacity = 0.0;
            style.radius = 0.1;
            style.opacity = 0.0;

            data.portal.setStyle(style);
        }
    }

    window.plugin.bonerunlinked.unlinked = function(guid) {
        // var fieldGuids = getPortalFields(guid)
        var linkGuids = getPortalLinks(guid)

        var in_links = false
        var out_links = false

        if (linkGuids != undefined) {
            //return ((linkGuids.in != undefined && linkGuids.in.length > 0) || (linkGuids.out != undefined && linkGuids.out.length > 0));
            if( linkGuids.in == undefined && linkGuids.in.length == 0){
                in_links = false
            } else {
                in_links = true
            }
            if( linkGuids.out != undefined && linkGuids.out.length > 0){
                out_links = false;
            } else {
                out_links = true;
            }
            console.log("inout: ", in_links, out_links)
            return (in_links || out_links)
        }
        return true
    }

    window.plugin.bonerunlinked.highlightUnlinked = function(data) {
        window.plugin.bonerunlinked.hideLinked(data, window.plugin.bonerunlinked.unlinked);
    }

    var setup =  function() {
        window.addPortalHighlighter('Unlinked', window.plugin.bonerunlinked.highlightUnlinked);
    }

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

