
	var map1 = L.map('map1', {attributionControl: false}).setView([52.51, 13.37], 12);	//Berlin
	var map2 = L.map('map2').setView([59.329323, 18.068581], 12);	//Stockholm
	map2.zoomControl.setPosition('topright');
	map1.zoomControl.setPosition('topright');


	map1.createPane('base');
	map1.getPane('base').style.zIndex = 100;
	map1.createPane('vec');
	map1.getPane('vec').style.zIndex = 200;
	map1.createPane('labels');
	map1.getPane('labels').style.zIndex = 300;

	var basemap1 = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
		attributionControl: false,
		attribution: '',
		subdomains: 'abcd',
		maxZoom: 16,
		pane: 'base'
	}); //.addTo(map1);

	map2.createPane('base');
	map2.getPane('base').style.zIndex = 100;
	map2.createPane('vec');
	map2.getPane('vec').style.zIndex = 200;
	map2.createPane('labels');
	map2.getPane('labels').style.zIndex = 300;

	var basemap2 = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 16,
		pane: 'base'
	}); //.addTo(map2);

	var iamgery1 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});

	var iamgery2 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});

	var labels1 = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png',
		pane: 'labels',
	});

	var labels2 = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png',
		pane: 'labels',
	});

	var sBase = {
	    "color": "#fff",
	    "weight": 0.5,
	    "opacity": 1,
	    "fillColor": "333",
	    "fillOpacity":0.1
	};
	var sHover = {
	    "color": "#333",
	    "weight": 3,
	    "opacity": 1.0,
	    "fillColor": "333",
	    "fillOpacity":0.10
	};


	var selected1, selected2 = null;



	var lBerlin = new L.GeoJSON.AJAX("data/berlin_sub.geojson",{
		style: sBase,
		pane: 'vec',
		onEachFeature: function (feature, layer) {
			layer.bindTooltip('Click to select region.');
		    layer.on('mouseover', function () {
		      var vis = $('#lock2').is(":visible");
		      if (vis) {
		      	this.openTooltip();
		      } else {
		      	this.closeTooltip();
		      	this.setStyle(sHover);
			    _selectedHex = feature.properties.hexid;
			    findSimilarLayersStockholm(feature.properties.hexid, false);
			  }
		    });
		    layer.on('mouseout', function () {
		      var vis2 = $('#lock2').is(":visible");
		      var vis1 = $('#lock1').is(":visible");
		      if (vis1) {
		      	this.closeTooltip();
		      } else if (!vis2 && vis1) {
		      	this.setStyle(sBase);
		      } else if (!vis1 && !vis2) {
		      	this.setStyle(sBase);
		        lStockholm.eachLayer(function(layer) {
 				  layer.setStyle(sBase);
			     });
		      }
		    });
		    layer.on('click', function () {
		      if (!$('#lock2').is(":visible")) {
			      var sel = this.toGeoJSON();
			      $('#lock1').show();
			      $('#lockdetails').show();
			      selected1 = L.geoJSON(sel, {'fillColor':'#66ffff', 'color': '#333333', 'fillOpacity':0.5});
			      selected1.addTo(map1);
			      findSimilarLayersStockholm(feature.properties.hexid, true);
			      _which = 1;
			  }
		    }); 
		  }
		}
	);      

	

	var lStockholm = new L.GeoJSON.AJAX("data/stockholm_sub.geojson",{
		style: sBase,
		pane: 'vec',
		onEachFeature: function (feature, layer) {
			layer.bindTooltip('');
		    layer.on('mouseover', function () {
		      var vis = $('#lock1').is(":visible");
		      if (vis) {
		      	this.openTooltip();
		      } else {
		      	this.closeTooltip();
		      	this.setStyle(sHover);
		      	_selectedHex = feature.properties.hexid;
		      	findSimilarLayersBerlin(feature.properties.hexid, false);
		      }
		    });
		    layer.on('mouseout', function () {
		      var vis2 = $('#lock2').is(":visible");
		      var vis1 = $('#lock1').is(":visible");
		      if (vis2 & !vis1) {
		      	this.closeTooltip();
		      } else if (!vis1 && !vis2) {
		      	this.setStyle(sBase);
		        lBerlin.eachLayer(function(layer) {
 				  layer.setStyle(sBase);
			     });
		      }
		    });
		    layer.on('click', function () {
		    	if (!$('#lock1').is(":visible")) {
			      var sel = this.toGeoJSON();
			      $('#lock2').show();
			      $('#lockdetails2').show();
			      selected2 = L.geoJSON(sel, {'fillColor':'#66ffff', 'color': '#333333', 'fillOpacity':0.5});
			      selected2.addTo(map2);
			      findSimilarLayersBerlin(feature.properties.hexid, true);
			      _which = 2;
			    }
		    }); 
		  }
		}
	);

	basemap1.addTo(map1);
	lBerlin.addTo(map1);
	labels1.addTo(map1);

	basemap2.addTo(map2);
	lStockholm.addTo(map2);
	labels2.addTo(map2);


	var baseMaps2 = {
	    "Stamen Roads": basemap2,
	    "ESRI Imagery": iamgery2
	};
	var overlayMaps2 = {
		"Hexagons": lStockholm,
	    "Labels": labels2
	};

	var baseMaps1 = {
	    "Stamen Roads": basemap1,
	    "ESRI Imagery": iamgery1
	};
	var overlayMaps1 = {
		"Hexagons": lBerlin,
	    "Labels": labels1
	};

	L.control.layers(baseMaps1, overlayMaps1).addTo(map1);
	L.control.layers(baseMaps2, overlayMaps2).addTo(map2);
