(function(e){function t(t){for(var r,i,s=t[0],l=t[1],c=t[2],u=0,d=[];u<s.length;u++)i=s[u],a[i]&&d.push(a[i][0]),a[i]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);p&&p(t);while(d.length)d.shift()();return o.push.apply(o,c||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,i=1;i<n.length;i++){var s=n[i];0!==a[s]&&(r=!1)}r&&(o.splice(t--,1),e=l(l.s=n[0]))}return e}var r={},i={app:0},a={app:0},o=[];function s(e){return l.p+"js/"+({about:"about"}[e]||e)+"."+{about:"29c489cd"}[e]+".js"}function l(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.e=function(e){var t=[],n={about:1};i[e]?t.push(i[e]):0!==i[e]&&n[e]&&t.push(i[e]=new Promise(function(t,n){for(var r="css/"+({about:"about"}[e]||e)+"."+{about:"e8a3e408"}[e]+".css",i=l.p+r,a=document.getElementsByTagName("link"),o=0;o<a.length;o++){var s=a[o],c=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(c===r||c===i))return t()}var u=document.getElementsByTagName("style");for(o=0;o<u.length;o++){s=u[o],c=s.getAttribute("data-href");if(c===r||c===i)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var r=t&&t.target&&t.target.src||i,a=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");a.request=r,n(a)},d.href=i;var p=document.getElementsByTagName("head")[0];p.appendChild(d)}).then(function(){i[e]=0}));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var o=new Promise(function(t,n){r=a[e]=[t,n]});t.push(r[2]=o);var c,u=document.getElementsByTagName("head")[0],d=document.createElement("script");d.charset="utf-8",d.timeout=120,l.nc&&d.setAttribute("nonce",l.nc),d.src=s(e),c=function(t){d.onerror=d.onload=null,clearTimeout(p);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src,o=new Error("Loading chunk "+e+" failed.\n("+r+": "+i+")");o.type=r,o.request=i,n[1](o)}a[e]=void 0}};var p=setTimeout(function(){c({type:"timeout",target:d})},12e4);d.onerror=d.onload=c,u.appendChild(d)}return Promise.all(t)},l.m=e,l.c=r,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)l.d(n,r,function(t){return e[t]}.bind(null,r));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="/ees-ui/",l.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=t,c=c.slice();for(var d=0;d<c.length;d++)t(c[d]);var p=u;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"0d8e":function(e,t,n){var r={"./":"3d9e","./direct_select":"1cc8","./direct_select.js":"1cc8","./draw_line_string":"fa98","./draw_line_string.js":"fa98","./draw_point":"f512","./draw_point.js":"f512","./draw_polygon":"9dfa","./draw_polygon.js":"9dfa","./index":"3d9e","./index.js":"3d9e","./mode_interface":"e287","./mode_interface.js":"e287","./mode_interface_accessors":"a5d8","./mode_interface_accessors.js":"a5d8","./object_to_mode":"6ead","./object_to_mode.js":"6ead","./simple_select":"a862","./simple_select.js":"a862"};function i(e){var t=a(e);return n(t)}function a(e){var t=r[e];if(!(t+1)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return t}i.keys=function(){return Object.keys(r)},i.resolve=a,e.exports=i,i.id="0d8e"},1570:function(e,t,n){"use strict";var r=n("826e"),i=n.n(r);i.a},"24f5":function(e,t,n){"use strict";var r=n("9c29"),i=n.n(r);i.a},5630:function(e,t,n){"use strict";var r=n("d8a7"),i=n.n(r);i.a},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("097d");var r=n("2b0e"),i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",{attrs:{id:"nav"}},[n("router-link",{attrs:{to:"/"}},[e._v("Home")]),e._v(" |\n    "),n("router-link",{attrs:{to:"/about"}},[e._v("About")])],1),n("router-view",{staticClass:"router-view"})],1)},a=[],o=(n("5c0b"),n("2877")),s={},l=Object(o["a"])(s,i,a,!1,null,null,null);l.options.__file="App.vue";var c=l.exports,u=n("8c4f"),d=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{on:{"!keydown":function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27,t.key,"Escape"))return null;e.toggleSettings()}}},[n("maplayer"),n("slider"),n("spinner"),n("settings")],1)},p=[],m=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("mapbox",{attrs:{"access-token":e.mapboxAccessToken,"map-options":e.mapOpts,"geolocate-control":{show:!0,position:"top-left"},"scale-control":{show:!0,position:"bottom-left"},"fullscreen-control":{show:!0,position:"top-left"}},on:{"map-load":e.storeMapInstance}})},f=[],g=(n("f751"),n("be94")),y=n("7be2"),h=n.n(y),v=n("e192"),b=n.n(v),S=n("6ee6"),_=n.n(S),F=n("b106"),L=n.n(F),x=n("2f62"),w=(n("7514"),{mapboxAccessToken:"pk.eyJ1IjoiZGhpeHNpbmdoIiwiYSI6ImNqbWx4OTR0ZzBkMWUzb255and1aTUweGkifQ.U0vPiwyfM4ad7axC_4dkHg",styles:[{id:"basic",name:"Basic"},{id:"bright",name:"Bright"},{id:"dark",name:"Dark"},{id:"light",name:"Light"},{id:"satellite",name:"Satellite"},{id:"streets",name:"Streets"}],regions:[{id:"Mount_Alexander_Shire",name:"Mount Alexander Shire",center:[144.212304,-37.064737],matsimNetworkLayer:"mount_alexander_shire_networkP",matsimNetworkTiles:"https://ees-server.now.sh/matsim-tiles/mount-alexander-shire/{z}/{x}/{y}.pbf",phoenixRuns:[{id:"20160420_MtAlexShire_FDI50_Iso",name:"20160420 Maldon FFDI50 ISO",description:"Forest Fire Danger Index (FFDI) 50 with south west wind change; based on 11:00 point fire ignition and running until 18:00",geojson:"https://raw.githubusercontent.com/agentsoz/ees/72222359e6418bf491b8176ab47586dcbd551bc5/scenarios/mount-alexander-shire/app-data/maldon/20160420_MtAlexShire_FDI50_Iso.json"},{id:"20160420_MtAlexShire_FDI75_Iso",name:"20160420 Maldon FFDI75 ISO",description:"Forest Fire Danger Index (FFDI) 75 with south west wind change; based on 11:00 point fire ignition and running until 18:00",geojson:"https://raw.githubusercontent.com/agentsoz/ees/72222359e6418bf491b8176ab47586dcbd551bc5/scenarios/mount-alexander-shire/app-data/maldon/20160420_MtAlexShire_FDI75_Iso.json"}]},{id:"Surf_Coast_Shire",name:"Surf Coast Shire",center:[144.326271,-38.332386],matsimNetworkLayer:"surf_coast_shire_networkP",matsimNetworkTiles:"https://ees-server.now.sh/matsim-tiles/surf-coast-shire/{z}/{x}/{y}.pbf",phoenixRuns:[{id:"Anglesea_evac_test_ffdi104_phx5_2016data_minsup_fh2017_grid_WSG84",name:"Anglesea_FFDI104 PHX5 2016 MINSUP FH2017 GRID",description:"12:00 point fire ignition",geojson:"https://raw.githubusercontent.com/agentsoz/ees/f25dd3427060180f08716c25198d5b6e0e530fd9/scenarios/surf-coast-shire/data/phoenix/Anglesea_evac_test_ffdi104_phx5_2016data_minsup_fh2017_grid_WSG84.json"}]}]}),I={mapboxAccessToken:function(e){return e.mapboxAccessToken},styles:function(e){return e.styles},regions:function(e){return e.regions},region:function(e){return function(t){return e.regions.find(function(e){return e.id===t})}},firesInRegion:function(e,t){return function(e){var n=t.region(e);return n.phoenixRuns}}},T={},M={},k={state:w,getters:I,mutations:T,actions:M},A=(n("6b54"),n("55dd"),n("ac4d"),n("8a81"),n("ac6a"),n("6762"),n("2fdb"),{isLoading:0,mapboxStyle:"dark",firstSymbolLayer:null,mapSettingsIsOpen:!1,baseMATSimLayer:null,highlightMATSimLayer:null,loadedMATSimLayers:[],loadedMATSimSource:null,selectedRegion:null,fireStepMinutes:10,selectedFire:null,loadedFireLayers:[],loadedFireSources:[],visibleFireStep:null,fire3DFlameHeight:!1,fireSliderTicks:!0,fireOpacity:.4,fireIntensityLevels:[[0,"#ffc107"],[1e5,"#dc3545"]],populationSquares:[],mapInstance:null,drawInstance:null,mapCenter:[144.968447,-37.818232]}),O={mapInstance:function(e){return e.mapInstance},drawInstance:function(e){return e.drawInstance},selectedRegion:function(e,t,n,r){return e.selectedRegion?r.region(e.selectedRegion):null},fireStepMinutes:function(e){return e.fireStepMinutes},visibleFireStep:function(e){return e.visibleFireStep},totalFireLayers:function(e){return e.loadedFireLayers.length},firesInSelectedRegion:function(e,t,n,r){return e.selectedRegion?r.firesInRegion(e.selectedRegion):null},selectedFire:function(e,t){var n=t.firesInSelectedRegion;if(!n)return null;var r=n.find(function(t){return t.id===e.selectedFire});return r}},N={startLoading:function(e){e.isLoading++},doneLoading:function(e){e.isLoading>0&&e.isLoading--},setMapInstance:function(e,t){e.mapInstance=t},setDrawInstance:function(e,t){e.drawInstance=t},setMapboxStyle:function(e,t){e.mapboxStyle=t,e.mapInstance.setStyle("mapbox://styles/mapbox/"+e.mapboxStyle+"-v9")},setMapSettingsIsOpen:function(e,t){e.mapSettingsIsOpen=t},setSelectedRegion:function(e,t){e.selectedRegion=t},setBaseMATSimLayer:function(e,t){e.baseMATSimLayer=t},setHighlightMATSimLayer:function(e,t){e.highlightMATSimLayer=t},flyTo:function(e,t){e.mapInstance.flyTo({center:t,zoom:8,bearing:0,speed:.5,curve:1,easing:function(e){return e}}),e.mapCenter=t},setFirstSymbolLayer:function(e){for(var t,n=e.mapInstance.getStyle().layers,r=0;r<n.length;r++)if("symbol"===n[r].type&&n[r].id.includes("label")){t=n[r].id;break}e.firstSymbolLayer=t},addMATSimLayer:function(e,t){e.mapInstance.addLayer({id:t.layerName,type:"line",source:t.sourceName,"source-layer":t.sourceLayer,minzoom:0,maxzoom:22,paint:t.paint,filter:t.filter},e.firstSymbolLayer),e.loadedMATSimLayers.push(t.layerName)},loadMATSimSource:function(e,t){e.mapInstance.addSource(t.sourceName,{type:"vector",tiles:[t.pbfurl],minzoom:0,maxzoom:14}),e.loadedMATSimSource=t.sourceName},clearMATSimLayers:function(e){var t=e.mapInstance,n=!0,r=!1,i=void 0;try{for(var a,o=e.loadedMATSimLayers[Symbol.iterator]();!(n=(a=o.next()).done);n=!0){var s=a.value;t.removeLayer(s)}}catch(l){r=!0,i=l}finally{try{n||null==o.return||o.return()}finally{if(r)throw i}}e.loadedMATSimLayers=[],e.loadedMATSimSource&&(t.removeSource(e.loadedMATSimSource),e.loadedMATSimSource=null),e.baseMATSimLayer=null,e.highlightMATSimLayer=null},setSelectedFire:function(e,t){e.selectedFire=t},addPopulationSquare:function(e,t){e.populationSquares.push(t)},addFireSource:function(e,t){var n=e.mapInstance,r=t.sourceName;n.addSource(r,{type:"geojson",data:t.geojson}),e.loadedFireSources.push(r)},addFireLayer:function(e,t){var n=e.mapInstance;e.fire3DFlameHeight?n.addLayer({id:t.layerName,type:"fill-extrusion",source:t.sourceName,filter:["has","FLAME_HT"],layout:{visibility:"none"},paint:{"fill-extrusion-color":{property:"E_INTSTY",stops:e.fireIntensityLevels},"fill-extrusion-height":{property:"FLAME_HT",stops:[[0,1],[300,1e3]]},"fill-extrusion-base":0,"fill-extrusion-opacity":e.fireOpacity}},e.firstSymbolLayer):n.addLayer({id:t.layerName,type:"fill",source:t.sourceName,layout:{visibility:"none"},paint:{"fill-color":{property:"E_INTSTY",stops:e.fireIntensityLevels},"fill-opacity":e.fireOpacity}},e.firstSymbolLayer),e.loadedFireLayers.push(t.layerName)},setFire3DFlameHeight:function(e,t){e.fire3DFlameHeight=t},clearFire:function(e){var t=e.mapInstance,n=!0,r=!1,i=void 0;try{for(var a,o=e.loadedFireLayers[Symbol.iterator]();!(n=(a=o.next()).done);n=!0){var s=a.value;t.removeLayer(s)}}catch(f){r=!0,i=f}finally{try{n||null==o.return||o.return()}finally{if(r)throw i}}e.loadedFireLayers=[];var l=!0,c=!1,u=void 0;try{for(var d,p=e.loadedFireSources[Symbol.iterator]();!(l=(d=p.next()).done);l=!0){var m=d.value;t.removeSource(m)}}catch(f){c=!0,u=f}finally{try{l||null==p.return||p.return()}finally{if(c)throw u}}e.loadedFireSources=[]},setVisibleFireStep:function(e,t){e.visibleFireStep=t}},R={resetAndMapboxStyle:function(e,t){var n=e.commit;n("clearFire"),n("clearMATSimLayers"),n("setMapboxStyle",t)},loadMATSimRegion:function(e){var t=e.dispatch,n=e.commit;n("clearFire"),n("clearMATSimLayers"),t("loadLayers")},loadLayers:function(e){var t=e.dispatch,n=e.getters,r=n.selectedRegion;if(r){var i={sourceName:"matsim",pbfurl:r.matsimNetworkTiles,layerName:r.matsimNetworkLayer,sourceLayer:r.matsimNetworkLayer,paint:{"line-color":"#7777ff","line-width":.5},filter:["all"]};t("loadMATSimNetwork",i);var a=n.selectedFire;a&&t("fetchFire",a.geojson)}},fetchFire:function(e,t){var n=e.dispatch,r=e.commit,i=e.getters;r("startLoading"),fetch(t).then(function(e){return e.json()}).then(function(e){var t=e.features;t.sort(function(e,t){return null===e.properties.HOUR_BURNT?-1:null===t.properties.HOUR_BURNT?1:e.properties.HOUR_BURNT-t.properties.HOUR_BURNT});var a=t[t.length-1],o=60*a.properties.HOUR_BURNT,s=Math.ceil(o/i.fireStepMinutes),l=0;while(null===t[l].properties.HOUR_BURNT)l++;for(var c=0;c<s;c++){var u=c*i.fireStepMinutes/60,d={type:"FeatureCollection",features:[]};while(t[l].properties.HOUR_BURNT<u)d.features.push(t[l]),l++;var p=c.toString(),m="phoenix-layer"+p,f="phoenix-source"+p;r("addFireSource",{sourceName:f,geojson:d}),r("addFireLayer",{sourceName:f,layerName:m})}n("filterFire",s-1),r("doneLoading")})},filterFire:function(e,t){for(var n=e.getters,r=e.commit,i=n.mapInstance,a=0;a<n.totalFireLayers;a++){var o="phoenix-layer"+a.toString();a<=t?i.setLayoutProperty(o,"visibility","visible"):i.setLayoutProperty(o,"visibility","none")}r("setVisibleFireStep",t)},resetFireLayers:function(e){var t,n,r,i=e.dispatch,a=e.getters,o=e.commit,s=A.mapInstance,l=a.totalFireLayers;for(t=0;t<l;t++)n=t.toString(),r="phoenix-layer"+n,s.removeLayer(r);for(A.loadedFireLayers=[],t=0;t<l;t++){n=t.toString();var c="phoenix-source"+n;r="phoenix-layer"+n,o("addFireLayer",{sourceName:c,layerName:r})}i("filterFire",a.visibleFireStep)},loadMATSimNetwork:function(e,t){var n=e.commit;n("startLoading"),fetch("https://ees-server.now.sh/wake/please").then(function(){n("doneLoading")}),n("loadMATSimSource",t),n("addMATSimLayer",t),n("setBaseMATSimLayer",t.layerName);var r=JSON.parse(JSON.stringify(t));r=Object.assign(r,{layerName:t.layerName+"-highlighted",paint:{"line-color":"#FF8C00","line-width":1.5},filter:["in","ID",""]}),n("addMATSimLayer",r),n("setHighlightMATSimLayer",r.layerName)}},j={state:A,getters:O,mutations:N,actions:R};r["a"].use(x["a"]);var C=new x["a"].Store({modules:{config:k,map:j}}),D={name:"maplayer",computed:Object(g["a"])({},Object(x["c"])({mapboxAccessToken:function(e){return e.config.mapboxAccessToken},mapboxStyle:function(e){return e.map.mapboxStyle},mapCenter:function(e){return e.map.mapCenter},mapInstance:function(e){return e.map.mapInstance},baseMATSimLayer:function(e){return e.map.baseMATSimLayer},highlightMATSimLayer:function(e){return e.map.highlightMATSimLayer}}),{mapOpts:function(){var e={style:"mapbox://styles/mapbox/"+this.mapboxStyle+"-v9",center:this.mapCenter,minZoom:0,zoom:6,maxZoom:14};return e}}),components:{mapbox:h.a},methods:{storeMapInstance:function(e){e.on("click",this.mapOnClick),e.on("draw.create",this.squareCreated),e.on("style.load",this.resetLayersOnStyleChange);var t=new _.a({displayControlsDefault:!1,modes:Object.assign({draw_rectangle:L.a},_.a.modes)});e.addControl(t),C.commit("setMapInstance",e),C.commit("setDrawInstance",t),C.commit("setFirstSymbolLayer")},resetLayersOnStyleChange:function(){C.commit("setFirstSymbolLayer"),C.dispatch("loadMATSimRegion")},squareCreated:function(e){C.commit("addPopulationSquare",e)},mapOnClick:function(e){var t,n=[[e.point.x-5,e.point.y-5],[e.point.x+5,e.point.y+5]],r=this.mapInstance.queryRenderedFeatures(n,{layers:[this.baseMATSimLayer]});if("undefined"!=typeof r&&0!==r.length){var i=r[0].geometry.coordinates.slice()[0][0],a=r[0].properties.ID;(new b.a.Popup).setLngLat(i).setHTML("Link "+a).addTo(this.mapInstance),t=r.reduce(function(e,t){return e.push(t.properties.ID),e},["in","ID"])}else t=["in","ID",""];this.mapInstance.setFilter(this.highlightMATSimLayer,t)}}},$=D,E=(n("d12e"),Object(o["a"])($,m,f,!1,null,"70c991d5",null));E.options.__file="Map.vue";var H=E.exports,P=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.visibleFireStep||0===e.visibleFireStep?n("div",{staticClass:"time-slider-overlay"},[n("div",{staticClass:"time-slider-overlay-inner"},[n("vue-slider",e._b({ref:"fireslider",attrs:{id:"custom-tootip"},on:{callback:e.updateFilter},scopedSlots:e._u([{key:"label",fn:function(t){var r=t.label,i=t.active;return[e.renderLabelTick(r)?n("span",{class:["custom-label",{active:i}]},[e._v("\n          "+e._s(e.stepToLabel(r))+"\n        ")]):e._e()]}}])},"vue-slider",e.sliderConfig,!1))],1)]):e._e()},U=[],B=(n("f576"),n("6f79")),z=n.n(B),q={name:"mapSlider",components:{vueSlider:z.a},props:{},data:function(){var e=[];return e["sm"]=12,e["md"]=9,e["lg"]=6,{labelStep:e}},computed:Object(g["a"])({},Object(x["c"])({visibleFireStep:function(e){return e.map.visibleFireStep},fireSliderTicks:function(e){return e.map.fireSliderTicks}}),Object(x["b"])(["totalFireLayers"]),{sliderConfig:function(){return{width:"98%",show:!0,value:this.visibleFireStep?this.visibleFireStep:0,min:0,max:this.totalFireLayers?this.totalFireLayers-1:0,piecewiseLabel:!0,tooltip:!1}}}),methods:{renderLabelTick:function(e){if(this.fireSliderTicks||this.hasLabel(e))return!0},hasLabel:function(e){var t=this.$data.labelStep[this.$mq],n=e<this.totalFireLayers-t+1;return e%t===0&&n||e===this.totalFireLayers-1},stepToLabel:function(e){return this.hasLabel(e)?"+"+Math.floor(10*e/60).toString()+":"+(10*e%60).toString().padStart(2,"0"):""},updateFilter:function(e){this.$store.dispatch("filterFire",e)}}},G=q,J=(n("24f5"),Object(o["a"])(G,P,U,!1,null,null,null));J.options.__file="MapTimeSlider.vue";var W=J.exports,Z=function(){var e=this,t=e.$createElement,n=e._self._c||t;return 0!==e.isLoading?n("div",{staticClass:"load-spinner-overlay"},[e._m(0)]):e._e()},Y=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"load-spinner-overlay-inner"},[n("span",{staticClass:"loading"})])}],V={name:"mapSpinner",props:{},computed:Object(g["a"])({},Object(x["c"])({isLoading:function(e){return e.map.isLoading}}))},Q=V,X=(n("1570"),Object(o["a"])(Q,Z,Y,!1,null,null,null));X.options.__file="MapLoadSpinner.vue";var K=X.exports,ee=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"map-settings-container",on:{"!keydown":function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27,t.key,"Escape"))return null;e.toggle()}}},[n("div",{staticClass:"map-settings-button-container mapboxgl-ctrl-top-right"},[n("div",{staticClass:"mapboxgl-ctrl mapboxgl-ctrl-group"},[n("button",{staticClass:"icon sprocket",attrs:{type:"button"},on:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27,t.key,"Escape"))return null;e.toggle()},click:function(t){e.toggle()}}})]),n("div",{staticClass:"mapboxgl-ctrl mapboxgl-ctrl-group"},[n("button",{staticClass:"icon grid",attrs:{type:"button"},on:{click:function(t){e.drawRectangle()}}})])]),n("div",{directives:[{name:"show",rawName:"v-show",value:e.isOpen,expression:"isOpen"}],staticClass:"map-overlay"},[n("div",{staticClass:"map-settings-panel",on:{"!keydown":function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27,t.key,"Escape"))return null;e.toggle()}}},[n("label",{attrs:{for:"map-style"}},[e._v("Map style:")]),n("select",{directives:[{name:"model",rawName:"v-model",value:e.mapboxStyle,expression:"mapboxStyle"}],attrs:{id:"map-style"},on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.mapboxStyle=t.target.multiple?n:n[0]}}},e._l(e.styles,function(t){return n("option",{key:t.id,attrs:{disabled:e.mapboxStyle==t.id},domProps:{value:t.id}},[e._v(e._s(t.name))])})),n("label",{attrs:{for:"map-region"}},[e._v("Region:")]),n("select",{directives:[{name:"model",rawName:"v-model",value:e.selectedRegion,expression:"selectedRegion"}],attrs:{id:"map-region"},on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.selectedRegion=t.target.multiple?n:n[0]}}},[n("option",{attrs:{value:"no-region",disabled:""}}),e._l(e.regions,function(t){return n("option",{key:t.id,attrs:{disabled:e.selectedRegion==t.id},domProps:{value:t.id}},[e._v(e._s(t.name))])})],2),n("label",{attrs:{for:"map-fire"}},[e._v("Phoenix Fire:")]),n("select",{directives:[{name:"model",rawName:"v-model",value:e.selectedFire,expression:"selectedFire"}],attrs:{id:"map-fire"},on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.selectedFire=t.target.multiple?n:n[0]}}},[n("option",{attrs:{value:"no-fire",disabled:""}}),e._l(e.firesInSelectedRegion,function(t){return n("option",{key:t.id,attrs:{disabled:e.selectedFire==t.id},domProps:{value:t.id}},[e._v(e._s(t.name))])})],2),n("label",{attrs:{for:"map-fire-3d"}},[e._v("Render Fire in 3D:")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.renderFireIn3D,expression:"renderFireIn3D"}],attrs:{id:"map-fire-3d",type:"checkbox"},domProps:{checked:Array.isArray(e.renderFireIn3D)?e._i(e.renderFireIn3D,null)>-1:e.renderFireIn3D},on:{change:function(t){var n=e.renderFireIn3D,r=t.target,i=!!r.checked;if(Array.isArray(n)){var a=null,o=e._i(n,a);r.checked?o<0&&(e.renderFireIn3D=n.concat([a])):o>-1&&(e.renderFireIn3D=n.slice(0,o).concat(n.slice(o+1)))}else e.renderFireIn3D=i}}})])])])},te=[],ne={name:"mapSettings",props:{},data:function(){return{styles:this.$store.state.config.styles,regions:this.$store.state.config.regions}},computed:{isOpen:{get:function(){return this.$store.state.map.mapSettingsIsOpen},set:function(e){this.$store.commit("mapSettingsIsOpen",e)}},firesInSelectedRegion:function(){return this.$store.getters.firesInSelectedRegion?this.$store.getters.firesInSelectedRegion:[]},mapboxStyle:{get:function(){return this.$store.state.map.mapboxStyle},set:function(e){this.toggle(),this.$store.dispatch("resetAndMapboxStyle",e)}},selectedRegion:{get:function(){return this.$store.state.map.selectedRegion?this.$store.state.map.selectedRegion:"no-region"},set:function(e){this.toggle(),this.$store.commit("setSelectedRegion",e),this.$store.dispatch("loadMATSimRegion"),this.$store.commit("flyTo",this.$store.getters.selectedRegion.center)}},selectedFire:{get:function(){return this.$store.state.map.selectedFire},set:function(e){this.toggle(),this.$store.commit("setSelectedFire",e);var t=this.$store.getters.selectedFire;this.$store.dispatch("fetchFire",t?t.geojson:"")}},renderFireIn3D:{get:function(){return this.$store.state.map.fire3DFlameHeight},set:function(e){this.toggle(),this.$store.commit("setFire3DFlameHeight",e),this.$store.dispatch("resetFireLayers")}}},methods:{toggle:function(){this.$store.commit("setMapSettingsIsOpen",!this.$store.state.map.mapSettingsIsOpen)},drawRectangle:function(){var e=this.$store.getters.drawInstance;e.changeMode("draw_rectangle")}}},re=ne,ie=(n("5630"),Object(o["a"])(re,ee,te,!1,null,null,null));ie.options.__file="MapSettings.vue";var ae=ie.exports,oe={name:"home",components:{maplayer:H,slider:W,spinner:K,settings:ae},methods:{toggleSettings:ae.methods.toggle}},se=oe,le=Object(o["a"])(se,d,p,!1,null,null,null);le.options.__file="Home.vue";var ce=le.exports;r["a"].use(u["a"]);var ue=new u["a"]({routes:[{path:"/",name:"home",component:ce},{path:"/about",name:"about",component:function(){return n.e("about").then(n.bind(null,"f820"))}}]}),de=n("9f7b"),pe=(n("f9e3"),n("2dd8"),n("660e"));r["a"].use(de["a"]),r["a"].use(pe["a"]),r["a"].config.productionTip=!1,new r["a"]({el:"#app",router:ue,store:C,render:function(e){return e(c)}}).$mount("#app")},"5c0b":function(e,t,n){"use strict";var r=n("5e27"),i=n.n(r);i.a},"5e27":function(e,t,n){},"826e":function(e,t,n){},"9c29":function(e,t,n){},d12e:function(e,t,n){"use strict";var r=n("fb16"),i=n.n(r);i.a},d8a7:function(e,t,n){},fb16:function(e,t,n){}});
//# sourceMappingURL=app.fe492056.js.map