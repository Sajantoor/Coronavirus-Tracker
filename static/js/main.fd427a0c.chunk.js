(this["webpackJsonpcovid19-tracker"]=this["webpackJsonpcovid19-tracker"]||[]).push([[0],{104:function(e,t){},140:function(e,t,a){e.exports=a(154)},145:function(e,t,a){},146:function(e,t,a){},147:function(e,t,a){},148:function(e,t){},152:function(e,t,a){},153:function(e,t,a){},154:function(e,t,a){"use strict";a.r(t);var r=a(12),o=a.n(r),n=a(88),s=a.n(n),l=(a(145),a(101)),i=a.n(l),c=a(120),u=(a(146),a(107)),d=a(66),p=a(67),y=a(79),f=a(71),m=a(69),g=(a(147),function(e){Object(f.a)(a,e);var t=Object(m.a)(a);function a(){return Object(d.a)(this,a),t.apply(this,arguments)}return Object(p.a)(a,[{key:"render",value:function(){return o.a.createElement("div",{className:"tooltip"},o.a.createElement("h1",null," ",this.props.province?this.props.province+",":null," ",this.props.country," "),o.a.createElement("h2",null," ",o.a.createElement("span",{role:"img","aria-label":"confirmed"},"\ud83d\ude37"),": ",this.props.confirmed," "),o.a.createElement("h2",null," ",o.a.createElement("span",{role:"img","aria-label":"deaths"},"\ud83d\udc80"),": ",this.props.deaths," "),o.a.createElement("p",null," Lat: ",this.props.lat," Lng: ",this.props.lng," "),o.a.createElement("p",null," ",this.props.update," "))}}]),a}(o.a.Component)),h=a(175),v=(a(172),a(170)),b={largest:0,average:0};function T(e,t){b.largest=0,b.average=0;for(var a=0;a<e.locations.length;a++)e.locations[a].latest[t]>b.largest&&(b.largest=e.locations[a].latest[t]);b.average=e.latest[t]/(e.locations.length+1)}function k(e){for(var t=[3,252,11],a=[252,181,3],r=e/Math.sqrt(b.largest),o=[],n=0;n<3;n++)o[n]=parseInt((a[n]-t[n])*r+t[n]),o[n]>255?o[n]=255:o[n]<0&&(o[n]=0);if(e<Math.cbrt(b.average)){var s=e/Math.cbrt(b.average);o[3]=255*s,50>o[3]&&(0===e&&(o[3]=25),o[3]=50)}else o[3]=255;return o}document.addEventListener("mousemove",(function(e){var t=document.getElementById("tooltip"),a=e.clientX,r=e.clientY;w?(t.className="displayBlock",t.style.left=a+10+"px",t.style.top=r+10+"px"):t.className="displayNone";w=!1}));var w=!1;var E=function(e,t){return new h.a({id:"scatter",data:e.locations,opacity:1,filled:!0,radiusMaxPixels:7,radiusMinPixels:3,getPosition:function(e){return[e.coordinates.longitude,e.coordinates.latitude]},getFillColor:function(e){return k(e.latest[t])},updateTriggers:{getFillColor:function(e){return k(e.latest[t])}}})},x=function(e,t){return new h.a({id:"hover",data:e.locations,opacity:0,filled:!0,radiusMaxPixels:50,radiusMinPixels:30,getPosition:function(e){return[e.coordinates.longitude,e.coordinates.latitude]},onHover:function(e){return function(e,t,a){var r=document.getElementById("tooltip");if(e){var n=parseFloat(e.coordinates.latitude).toFixed(3),l=parseFloat(e.coordinates.longitude).toFixed(3);w=!0,s.a.render(o.a.createElement(g,{province:e.province?e.province:e.county,country:e.country,confirmed:e.latest.confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","),deaths:e.latest.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","),lat:n,lng:l,update:e.last_updated}),r)}}(e.object,e.x,e.y)},pickable:!0})},M=function(e,t){return new v.a({id:"heat",data:e.locations,getPosition:function(e){return[e.coordinates.longitude,e.coordinates.latitude]},getWeight:function(e){return e.latest[t]},radiusPixels:60,threshold:.005,updateTriggers:{getWeight:function(e){return e.latest[t]}}})},P=a(168),O=[{elementType:"geometry",stylers:[{color:"#1d2c4d"}]},{elementType:"labels.text.fill",stylers:[{color:"#8ec3b9"}]},{elementType:"labels.text.stroke",stylers:[{color:"#1a3646"}]},{featureType:"administrative.country",elementType:"geometry.stroke",stylers:[{color:"#4b6878"}]},{featureType:"administrative.land_parcel",elementType:"labels.text.fill",stylers:[{color:"#64779e"}]},{featureType:"administrative.province",elementType:"geometry.stroke",stylers:[{color:"#4b6878"}]},{featureType:"landscape.man_made",elementType:"geometry.stroke",stylers:[{color:"#334e87"}]},{featureType:"landscape.natural",elementType:"geometry",stylers:[{color:"#023e58"}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#283d6a"}]},{featureType:"poi",elementType:"labels.text",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#6f9ba5"}]},{featureType:"poi",elementType:"labels.text.stroke",stylers:[{color:"#1d2c4d"}]},{featureType:"poi.business",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{color:"#023e58"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#3C7680"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#304a7d"}]},{featureType:"road",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#98a5be"}]},{featureType:"road",elementType:"labels.text.stroke",stylers:[{color:"#1d2c4d"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#2c6675"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#255763"}]},{featureType:"road.highway",elementType:"labels.text.fill",stylers:[{color:"#b0d5ce"}]},{featureType:"road.highway",elementType:"labels.text.stroke",stylers:[{color:"#023e58"}]},{featureType:"transit",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"labels.text.fill",stylers:[{color:"#98a5be"}]},{featureType:"transit",elementType:"labels.text.stroke",stylers:[{color:"#1d2c4d"}]},{featureType:"transit.line",elementType:"geometry.fill",stylers:[{color:"#283d6a"}]},{featureType:"transit.station",elementType:"geometry",stylers:[{color:"#3a4762"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#0e1626"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#4e6d70"}]}],j=(a(152),a(153),function(e){Object(f.a)(a,e);var t=Object(m.a)(a);function a(e){var r;return Object(d.a)(this,a),(r=t.call(this,e)).state={messages:["Social distancing is the best way to prevent the spread of COVID-19.","Stay safe!","Stay at least 2 metres away from others...","Wash your hands regularly!","Wash your hands for at least 20 seconds!"],index:0},r}return Object(p.a)(a,[{key:"pickRandom",value:function(){var e=Math.floor(Math.random()*this.state.messages.length);this.setState({index:e})}},{key:"componentDidMount",value:function(){this.pickRandom()}},{key:"render",value:function(){return o.a.createElement("div",{className:"loading"},o.a.createElement("div",{className:"progress"}),o.a.createElement("h1",null," Loading 2,500+ COVID-19 (Coronavirus) data points ",o.a.createElement("span",{role:"img","aria-label":"sick-emoji"},"\ud83d\ude37")," "),o.a.createElement("p",null," ",this.state.messages[this.state.index]," "))}}]),a}(o.a.Component));function C(){return(C=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e}).apply(this,arguments)}function S(e,t){if(null==e)return{};var a,r,o=function(e,t){if(null==e)return{};var a,r,o={},n=Object.keys(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var F=o.a.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}),L=o.a.createElement("path",{d:"M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"}),D=function(e){var t=e.svgRef,a=e.title,r=S(e,["svgRef","title"]);return o.a.createElement("svg",C({id:"gps",height:24,viewBox:"0 0 24 24",width:24,ref:t},r),a?o.a.createElement("title",null,a):null,F,L)},N=o.a.forwardRef((function(e,t){return o.a.createElement(D,C({svgRef:t},e))})),z=(a.p,{latest:{},locations:[]}),R=function(e){Object(f.a)(a,e);var t=Object(m.a)(a);function a(e){var r;return Object(d.a)(this,a),(r=t.call(this,e)).googleMapRef=o.a.createRef(),r.getLocation=r.getLocation.bind(Object(y.a)(r)),r.resize=r.resize.bind(Object(y.a)(r)),r.state={layers:[],worldData:!1,usData:!1,dataParameter:"confirmed",heatMap:!1,scatterPlot:!0},r}return Object(p.a)(a,[{key:"componentDidMount",value:function(){this.getData();var e=this,t=document.createElement("script");t.src="https://maps.googleapis.com/maps/api/js?key=".concat("{ secrets.REACT_APP_GOOGLE_MAPS_API }}","&libraries=visualization"),window.document.body.appendChild(t),t.addEventListener("load",(function(){e.googleMap=e.createGoogleMap()}))}},{key:"createGoogleMap",value:function(){var e=new window.google.maps.Map(this.googleMapRef.current,{zoom:3,minZoom:2,center:{lat:30,lng:0},restriction:{latLngBounds:{north:85,south:-85,west:-180,east:180}},disableDefaultUI:!0,styles:O,draggableCursor:"crosshair",gestureHandling:"greedy"});return window.google.maps.event.addDomListener(window,"resize",this.resize),e}},{key:"requestLocation",value:function(){navigator.geolocation.getCurrentPosition(this.getLocation)}},{key:"getLocation",value:function(e){var t=e.coords.latitude,a=e.coords.longitude;this.googleMap.setCenter({lat:t,lng:a}),this.googleMap.setZoom(7)}},{key:"getData",value:function(){var e=this;_("https://coronavirus-tracker-api.herokuapp.com/v2/locations").then((function(t){for(var a=0;a<t.locations.length;a++){var r=t.locations[a];r.coordinates.latitude=parseFloat(r.coordinates.latitude),r.coordinates.longitude=parseFloat(r.coordinates.longitude),"US"===r.country||"Grand Princess"===r.province||0===r.coordinates.latitude&&0===r.coordinates.longitude||(r.last_updated=B(r.last_updated),z.locations.push(r))}z.latest=t.latest,e.setState({worldData:!0})})),_("https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs").then((function(t){for(var a=0;a<t.locations.length;a++)t.locations[a].last_updated=B(t.locations[a].last_updated),t.locations[a].coordinates.latitude=parseFloat(t.locations[a].coordinates.latitude),t.locations[a].coordinates.longitude=parseFloat(t.locations[a].coordinates.longitude),z.locations.push(t.locations[a]);e.setState({usData:!0})}))}},{key:"resize",value:function(){var e=this.googleMap.getCenter();window.google.maps.event.trigger(this.googleMap,"resize"),this.googleMap.setCenter(e)}},{key:"initLayers",value:function(){var e=[this.state.heatMap?M(z,this.state.dataParameter):null,this.state.scatterPlot?E(z,this.state.dataParameter):null,x(z,this.state.dataParameter)];this.overlay=new P.a({layers:e}),this.overlay.setMap(this.googleMap),this.setState({layers:e})}},{key:"changeLayers",value:function(){T(z,this.state.dataParameter);var e=[this.state.heatMap?M(z,this.state.dataParameter):null,this.state.scatterPlot?E(z,this.state.dataParameter):null,x(z,this.state.dataParameter)];this.setState({layers:e}),this.overlay.setProps({layers:e})}},{key:"componentDidUpdate",value:function(e,t){var a=Object(u.a)({},this.state),r=Object(u.a)({},t),o=this.state.layers.length;a.layers=0,r.layers=0,this.state.usData&&this.state.worldData&&0===o?(T(z,this.state.dataParameter),this.initLayers()):JSON.stringify(a)!==JSON.stringify(r)&&0!==o&&this.changeLayers()}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{className:"map-container"},!(this.state.usData&&this.state.worldData)&&o.a.createElement(j,null),o.a.createElement("div",{id:"tooltip",className:"displayNone",style:{position:"absolute",zIndex:3}}),o.a.createElement("button",{style:{backgroundColor:this.state.scatterPlot?"#FFF":"#cfcfcf"},onClick:function(){return e.setState({scatterPlot:!e.state.scatterPlot})}},"Scatterplot"),o.a.createElement("button",{style:{backgroundColor:this.state.heatMap?"#FFF":"#cfcfcf"},onClick:function(){return e.setState({heatMap:!e.state.heatMap})}},"Heat Map"),o.a.createElement("div",{className:"divider"}),o.a.createElement("button",{style:{backgroundColor:"confirmed"===this.state.dataParameter?"#FFF":"#cfcfcf"},onClick:function(){return e.setState({dataParameter:"confirmed"})}},o.a.createElement("span",{role:"img","aria-label":"confirmed"}," \ud83d\ude37 ")),o.a.createElement("button",{style:{backgroundColor:"deaths"===this.state.dataParameter?"#FFF":"#cfcfcf"},onClick:function(){return e.setState({dataParameter:"deaths"})}},o.a.createElement("span",{role:"img","aria-label":"deaths"}," \ud83d\udc80 ")),navigator.geolocation&&o.a.createElement("button",{className:"location","aria-label":"Location",onClick:function(){return e.requestLocation()}},o.a.createElement(N,null)),o.a.createElement("div",{id:"google-map",ref:this.googleMapRef}))}}]),a}(o.a.Component);function _(e){return I.apply(this,arguments)}function I(){return(I=Object(c.a)(i.a.mark((function e(t){var a,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:return a=e.sent,e.next=5,a.json();case 5:return r=e.sent,e.abrupt("return",r);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(e){return new Date(e).toLocaleString()}var H=function(){return o.a.createElement("div",{className:"App"},o.a.createElement(R,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(H,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[140,1,2]]]);
//# sourceMappingURL=main.fd427a0c.chunk.js.map