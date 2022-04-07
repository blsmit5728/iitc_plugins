// ==UserScript==
// @name           IITC plugin: Portal throwrange
// @id             iitc-plugin-throwrange@blsmit5728
// @category       Layer
// @version        1.0.0.20220407.000001
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://github.com/blsmit5728/iitc_plugins/raw/main/ingress-plugin-throwrange.user.js
// @downloadURL    https://github.com/blsmit5728/iitc_plugins/raw/main/ingress-plugin-throwrange.user.js
// @description    [iitc-20190613.013370] Shows the 'too close' radius of existing portals, in order to see where you can search for and submit new candidates
// @match          https://intel.ingress.com/*
// @match          http://intel.ingress.com/*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==

var L; // to prevent script errors on load
var $; // to prevent script errors on load
var map; // to prevent script errors on load

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
  plugin_info.buildName = 'iitc';
  plugin_info.dateTimeVersion = '20220407.000001';
  plugin_info.pluginId = 'throwrange';
  // PLUGIN START ///////////////////////////////////////////////////////

  // use own namespace for plugin
  window.plugin.throwrange = function() {};
  window.plugin.throwrange.layerlist = {};

   window.plugin.throwrange.update = function() {
     if (!window.map.hasLayer(window.plugin.throwrange.throwrangeLayers))
     return;

         if (window.map.hasLayer(window.plugin.throwrange.throwrangeLayers)) {
         window.plugin.throwrange.throwrangeLayers.clearLayers();

                 $.each(window.portals, function(i, portal) {
                        window.plugin.throwrange.draw(portal);
                 });
                 window.plugin.throwrange.urlMarker();
      }
   }

  window.plugin.throwrange.setSelected = function(a) {
    if (a.display) {
      var selectedLayer = window.plugin.throwrange.layerlist[a.name];
      if (selectedLayer !== undefined) {
        if (!window.map.hasLayer(selectedLayer)) {
                  window.map.addLayer(selectedLayer);
        }
        if (window.map.hasLayer(selectedLayer)) {
                 window.plugin.throwrange.update();
        }
      }
    }
  }

  // Define and add the throwrange circles for a given portal
  window.plugin.throwrange.draw = function(portal) {
    // Create a new location object for the portal
    var coo = portal._latlng;
    var latlng = new L.LatLng(coo.lat, coo.lng);

    // Specify the no submit circle options
    var circleOptions = {color:'black', opacity:1, fillColor:'purple', fillOpacity:0.40, weight:1, clickable:false, interactive:false};
    var range = 500; // Hardcoded to 20m, the universal too close for new submit range of a portal

    // Create the circle object with specified options
    var circle = new L.Circle(latlng, range, circleOptions);

    // Add the new circle to the throwrange draw layer
    circle.addTo(window.plugin.throwrange.throwrangeLayers);
  }

  window.plugin.throwrange.getParameterByName =        function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  window.plugin.throwrange.urlMarker = function() {
    var pll = window.plugin.throwrange.getParameterByName('pll')
    if (pll == undefined) {
        var ll = window.plugin.throwrange.getParameterByName('ll')
        if (ll != null) {
          var coords = ll.split(',');
          var markerLatLng = L.latLng(coords[0],coords[1]);

          var distanceToClosest = window.plugin.throwrange.getDistanceToClosest(markerLatLng);

          window.plugin.throwrange.createGenericMarker(markerLatLng, 'pink', {
            title: 'Url location ' + distanceToClosest,
          }).addTo(window.plugin.throwrange.throwrangeLayers);

          var marker = L.marker(markerLatLng, {
            icon: L.divIcon({
              className: 'plugin-throwdistance-name',
              iconAnchor: [100,5],
              iconSize: [200,10],
              html: distanceToClosest,
            })
          }).addTo(window.plugin.throwrange.throwrangeLayers);
        }
    }
  }


  window.plugin.throwrange.getDistanceToClosest = function(markerLatLng) {
      var bounds = map.getBounds();
        var closestPortal;
        var shortestDistance = -1;
        $.each(window.portals, function(i, portal) {
        var portalLatLng = portal.getLatLng();

                if (bounds.contains(portalLatLng)) {
                        var distance = markerLatLng.distanceTo(portalLatLng);
                                if (shortestDistance == -1) {
                                        shortestDistance = distance;
                                        closestPortal = portalLatLng;
                                }

                                if (distance != 0 && distance < shortestDistance) {
                                        shortestDistance = distance;
                                        closestPortal = portalLatLng;
                                }
                        }
        });

        if (shortestDistance > -1 && closestPortal != undefined) {
                        var poly = L.geodesicPolyline([markerLatLng,closestPortal] , {
                        color: 'pink',
                        opacity: 0.8,
                        weight: 3,
                        clickable: false,
                            dashArray: 10,
            html: shortestDistance
                }).addTo(window.plugin.throwrange.throwrangeLayers);
        return shortestDistance;
      }

      return '';
  }

   window.plugin.throwrange.getGenericMarkerSvg = function(color) {
      var markerTemplate = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg"\n   version="1.1" baseProfile="full"\n      width="25px" height="41px" viewBox="0 0 25 41">\n\n     <path d="M1.36241844765,18.67488124675 A12.5,12.5 0 1,1 23.63758155235,18.67488124675 L12.5,40.5336158073 Z" style="stroke:none; fill: %COLOR%;" />\n        <path d="M1.80792170975,18.44788599685 A12,12 0 1,1 23.19207829025,18.44788599685 L12.5,39.432271175 Z" style="stroke:#000000; stroke-width:1px; stroke-opacity: 0.15; fill: none;" />\n        <path d="M2.921679865,17.8803978722 A10.75,10.75 0 1,1 22.078320135,17.8803978722 L12.5,36.6789095943 Z" style="stroke:#ffffff; stroke-width:1.5px; stroke-opacity: 0.35; fill: none;" />\n\n        <path d="M19.86121593215,17.25 L12.5,21.5 L5.13878406785,17.25 L5.13878406785,8.75 L12.5,4.5 L19.86121593215,8.75 Z M7.7368602792,10.25 L17.2631397208,10.25 L12.5,18.5 Z M12.5,13 L7.7368602792,10.25 M12.5,13 L17.2631397208,10.25 M12.5,13 L12.5,18.5 M19.86121593215,17.25 L16.39711431705,15.25 M5.13878406785,17.25 L8.60288568295,15.25 M12.5,4.5 L12.5,8.5" style="stroke:#ffffff; stroke-width:1.25px; stroke-opacity: 1; fill: none;" />\n\n</svg>';

      return markerTemplate.replace(/%COLOR%/g, color);
  }

  window.plugin.throwrange.getGenericMarkerIcon = function(color,className) {
      return L.divIcon({
          iconSize: new L.Point(25, 41),
          iconAnchor: new L.Point(12, 41),
          html: window.plugin.throwrange.getGenericMarkerSvg(color),
          className: className || 'leaflet-iitc-divicon-generic-marker'
      });
  }

  window.plugin.throwrange.createGenericMarker = function(ll,color,options) {
      options = options || {};

      var markerOpt = $.extend({
          icon: window.plugin.throwrange.getGenericMarkerIcon(color || '#a24ac3')
      }, options);

      return L.marker(ll, markerOpt);
  }

 // Initialize the plugin and display throwranges if at an appropriate zoom level
  var setup = function() {
     $("<style>")
    .prop("type", "text/css")
    .html(".plugin-throwdistance-name {\
      font-size: 14px;\
      font-weight: bold;\
      color: gold;\
      opacity: 0.7;\
      text-align: center;\
      text-shadow: -1px -1px #000, 1px -1px #000, -1px 1px #000, 1px 1px #000, 0 0 2px #000; \
      pointer-events: none;\
    }")
    .appendTo("head");

      window.plugin.throwrange.throwrangeLayers = new L.LayerGroup();
          window.addLayerGroup('Portal Throw range', window.plugin.throwrange.throwrangeLayers, true);
          window.plugin.throwrange.layerlist['Portal Throw range'] =  window.plugin.throwrange.throwrangeLayers;
      addHook('mapDataRefreshEnd', window.plugin.throwrange.update);
          window.pluginCreateHook('displayedLayerUpdated');

      window.addHook('displayedLayerUpdated',  window.plugin.throwrange.setSelected);
          window.updateDisplayedLayerGroup = window.updateDisplayedLayerGroupModified;
  }

  // Overload for IITC default in order to catch the manual select/deselect event and handle it properly
// Update layerGroups display status to window.overlayStatus and localStorage 'ingress.intelmap.layergroupdisplayed'
 window.updateDisplayedLayerGroupModified = function(name, display) {
  overlayStatus[name] = display;
  localStorage['ingress.intelmap.layergroupdisplayed'] = JSON.stringify(overlayStatus);
  runHooks('displayedLayerUpdated', {name: name, display: display});
}



// PLUGIN END //////////////////////////////////////////////////////////
setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
}
// wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
