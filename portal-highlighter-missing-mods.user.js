// ==UserScript==
// @id             iitc-plugin-highlight-portals-missing-mods@amsdams
// @name           IITC plugin: highlight portals missing mods
// @category       Highlighter
// @version        1.0.0.20240819
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @id             portalHighligherPortalsMissingMods@blsmit5728
// @updateURL      https://raw.github.com/blsmit5728/iitc-plugins/raw/main/portal-highlighter-missing-mods.user.js
// @downloadURL    https://raw.github.com/blsmit5728/iitc-plugins/raw/main/portal-highlighter-missing-mods.user.js
// @description    [local-2013-09-26-081348] highlight portals missing mods 
// @include        https://intel.ingress.com/*
// @include        https://intel-x.ingress.com/*
// @match          https://intel.ingress.com/*
// @match          https://intel-x.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
  // ensure plugin framework is there, even if iitc is not yet loaded
  if(typeof window.plugin !== 'function') window.plugin = function() {};



  //PLUGIN START ////////////////////////////////////////////////////////
  //use own namespace for plugin
  window.plugin.portalHighligherPortalsMissingMods = function () {};
  
  window.plugin.portalHighligherPortalsMissingMods.MODS_PER_PORTAL=4;
  window.plugin.portalHighligherPortalsMissingMods.PORTAL_FILL_COLOR='red';
  window.plugin.portalHighligherPortalsMissingMods.PORTAL_FILL_OPACITY=0.7;

  /**
     * Indicates whether portals are displayed at the current level.  Simply using zoom level
     * does not factor in other tools that adjust display capabilities.
     */
  window.plugin.portalHighligherPortalsMissingMods.zoomLevelHasPortals = function() {
    return window.getMapZoomTileParameters(window.getDataZoomForMapZoom(window.map.getZoom())).hasPortals;
};

  window.plugin.portalHighligherPortalsMissingMods.highlight_missing = function(data, conditional) {
    var d = data.portal.options.data;
    var guid = data.portal.options.ent[0];
    if (conditional(guid) == false && window.plugin.portalHighligherPortalsMissingMods.zoomLevelHasPortals()) {
      // Hide any portal that meets the conditions.
      var style = {};

      style.fillOpacity = window.plugin.portalHighligherPortalsMissingMods.PORTAL_FILL_OPACITY;
      style.fillColor = window.plugin.portalHighligherPortalsMissingMods.PORTAL_FILL_COLOR;
      style.radius = 0.1;
      style.opacity = 0.0;

      data.portal.setStyle(style);
  }
  }

  window.plugin.portalHighligherPortalsMissingMods.highlight = function (data, missing) {
      // console.log("Data", data);
      mods = data.portal.options.data.mods;
      var missing_resos = 0;
      if( mods != undefined )
      {
        for( let i = 0; i < 4; i++)
        {
          if( mods[i] == null )
          {
            missing_resos++;
          }
        }
        if ( missing_resos > 0 )
        {
          var style = {};
          //style.fillOpacity = 1.0;
          style.fillColor = 'red';
          //style.radius = 0.6;
          //style.opacity = 1.0;
          data.portal.setStyle(style);
        }
      }
      
      //var mods = {}
      //var d = getPortalMiscDetails(data, mods)
      //console.log("Mods", mods)
      //   countMissing = 0;
      // $.each(mods, function (ind, mod) {
      //   console.log(ind, mod);
      //   if(!mod) {
      //     countMissing++;
      //   }
      // });
      // if(countMissing === missing) {
      //   data.portal.setStyle({
      //     fillColor: window.plugin.portalHighligherPortalsMissingMods.PORTAL_FILL_OPACITY,
      //     fillOpacity: window.plugin.portalHighligherPortalsMissingMods.PORTAL_FILL_COLOR
      //   });
      // }
  }
  window.plugin.portalHighligherPortalsMissingMods.getHighlighter = function (data) {
    window.plugin.portalHighligherPortalsMissingMods.highlight(data, window.plugin.portalHighligherPortalsMissingMods.highlight);
  }
  var setup = function () {
      window.addPortalHighlighter('Mods Missing', window.plugin.portalHighligherPortalsMissingMods.getHighlighter);
  }
  // PLUGIN END //////////////////////////////////////////////////////////

  setup.info = plugin_info;
  if(!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

