var _volberlin = new Array();
var _volstockholm = new Array();
var _param = 2;
var _sliders = new Array(33,34,33);
var _selectedHex = null;
var _which = 1;

 $( document ).ready(function() {
 	$.getJSON("data/berlin2stockholm.json", function(result){
	    /*for(var i in result) {
	    	var temp = [];
			$.each(result[i], function(key, value) {
			    temp.push({v:value, k: key});
			});
			temp.sort(function(a,b){
			   if(a.v > b.v){ return 1}
			    if(a.v < b.v){ return -1}
			      return 0;
			});
			var cnt = temp.length;
			var breaks = Math.floor(cnt / 10);

			var val = 0;

			for(var j in temp) {
				if (j % breaks == 0) {
					val++;
				}
				result[i][parseInt(temp[j].k)] = (val*10) - 10;
			}
			
	    } */
	    _volberlin = result;
	});

	$.getJSON("data/stockholm2berlin.json", function(result){
	    _volstockholm = result;
	});
	
	// #### SLIDERS ####
 	var handleuni = $( "#customuni" );
 	var handlevol = $( "#customvol" );
 	var handlets = $( "#customts" );
	$( "#slider-uni" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 100,
      value: _sliders[0],
      create: function() {
        handleuni.text( $( this ).slider( "value" ) );
      },
      stop: function( event, ui ) {
        //handleuni.text( ui.value );
        adjustall(ui.handle.id);
      }
    });
	$( "#slider-vol" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 100,
      value: _sliders[1],
      create: function() {
        handlevol.text( $( this ).slider( "value" ) );
      },
      stop: function( event, ui ) {
        //handlevol.text( ui.value );
        adjustall(ui.handle.id);
      }
    });
	$( "#slider-ts" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 100,
      value: _sliders[2],
      create: function() {
        handlets.text( $( this ).slider( "value" ) );
      },
      stop: function( event, ui ) {
        //handlets.text( ui.value );
        adjustall(ui.handle.id);
      }
    });
	
 });

$("#lock1").click(function(){cleanup();});
$("#lockdetails").click(function(){cleanup();});
$("#lock2").click(function(){cleanup();});
$("#lockdetails2").click(function(){cleanup();});

$("#instructions").click(function(){
	$("#instructions").hide();
	$("#instructionslock").hide();
});

$("#instructionslock").click(function(){
	$("#instructions").hide();
	$("#instructionslock").hide();
});


function cleanup() {
	$("#lock1").hide();
	$('#lockdetails').hide();
	$("#lock2").hide();
	$('#lockdetails2').hide();
	if(map1.hasLayer(selected1))
		map1.removeLayer(selected1);
	if(map2.hasLayer(selected2))
		map2.removeLayer(selected2);
	lBerlin.eachLayer(function(layer) {
		layer.setStyle(sBase);
    });
	lStockholm.eachLayer(function(layer) {
		layer.setStyle(sBase);
    });
}


function adjustall(id) {
	var uni = $( "#slider-uni" ).slider( "value" );
	var vol = $( "#slider-vol" ).slider( "value" );
	var ts = $( "#slider-ts" ).slider( "value" );

	var a = null;
	var b = null;
	var c = null;

	if(id == 'customuni') {
		var dif = 100 - uni;
		var sum = vol + ts;
		var diff = dif - sum;
		a = uni;
		if (sum > 0) {
			b = Math.round(diff * vol / sum) + vol;
			c = Math.round(diff * ts / sum) + ts;
		} else {
			b = diff / 2;
			c = diff / 2;
		}
	} else if(id == 'customvol') {
		var dif = 100 - vol;
		var sum = uni + ts;
		var diff = dif - sum;
		b = vol;
		if (sum > 0) {
			a = Math.round(diff * uni / sum) + uni;
			c = Math.round(diff * ts / sum) + ts;
		} else {
			a = diff / 2;
			c = diff / 2;
		}
	} else if(id == 'customts') {
		var dif = 100 - ts;
		var sum = uni + vol;
		var diff = dif - sum;
		if (sum > 0) {
			a = Math.round(diff * uni / sum) + uni;
			b = Math.round(diff * vol / sum) + vol;
		} else {
			a = diff / 2;
			b = diff / 2;
		}
		c = ts;

	} 
	$("#slider-uni").slider('value',a);
	$("#slider-vol").slider('value',b);
	$("#slider-ts").slider('value',c);
	$( "#customuni" ).text(a);
	$( "#customvol" ).text(b);
	$( "#customts" ).text(c);

	_sliders = new Array($( "#slider-uni" ).slider( "value" ),$( "#slider-vol" ).slider( "value" ),$( "#slider-ts" ).slider( "value" ));
	if (_which == 1)
		findSimilarLayersStockholm(_selectedHex, true);
	else
		findSimilarLayersBerlin(_selectedHex, true);
}



 function findSimilarLayersStockholm(hexid, click) {
 	if (!click)
 		lStockholm.setStyle(sBase);
 	if (hexid in _volberlin) {
 		var x = _volberlin[hexid];
 		var k = null;
 		for(key in x) {
 			k = parseInt(key);
 			lStockholm.eachLayer(function(layer) {
 				//layer.setStyle({'fillOpacity': 0.2, 'fillColor': '#fff'});
			    if (layer.feature.properties.hexid == k) {
			    	var weighted = (_sliders[0]/100 * x[k][0]) + (_sliders[1]/100 * x[k][1]) + (_sliders[2]/100 * x[k][2]);
			        var y = weighted; // x[k][_param]; //x[k] * 2.55; //Math.round( x[k] / 25.5) * 10;
			        var col = '#ffffd9'
			        if (y > 90)
			        	col = '#081d58';
			        else if (y > 80)
			        	col = '#253494';
			        else if (y > 70)
			        	col = '#225ea8';
			        else if (y > 60)
			        	col = '#1d91c0';
			        else if (y > 50)
			        	col = '#41b6c4';
			        else if (y > 40)
			        	col = '#7fcdbb';
			        else if (y > 30)
			        	col = '#c7e9b4';
			        else if (y > 20)
			        	col = '#edf8b1';
			        layer.setStyle({'fillOpacity': 0.7, 'fillColor': col});
			        var content = "Unique: "+x[k][0]+"<br/>Volume: "+x[k][1]+"<br/>Temp.Sig.: "+x[k][2]+"<br/><b>Weighted: "+Math.round(weighted*100)/100+"</b>";
			        layer.setTooltipContent(content);
			    } 
			})
 		}
 	}
 }

 function findSimilarLayersBerlin(hexid, click) {
 	if (!click)
 		lBerlin.setStyle(sBase);
 	if (hexid in _volstockholm) {
 		var x = _volstockholm[hexid];
 		var k = null;
 		for(key in x) {
 			k = parseInt(key);
 			lBerlin.eachLayer(function(layer) {
 				//layer.setStyle({'fillOpacity': 0.2, 'fillColor': '#fff'});
			    if (layer.feature.properties.hexid == k) {
			    	var weighted = (_sliders[0]/100 * x[k][0]) + (_sliders[1]/100 * x[k][1]) + (_sliders[2]/100 * x[k][2]);
			        var y = weighted; // x[k][_param]; //x[k] * 2.55; //Math.round( x[k] / 25.5) * 10;
			        var col = '#ffffd9'
			        if (y > 90)
			        	col = '#081d58';
			        else if (y > 80)
			        	col = '#253494';
			        else if (y > 70)
			        	col = '#225ea8';
			        else if (y > 60)
			        	col = '#1d91c0';
			        else if (y > 50)
			        	col = '#41b6c4';
			        else if (y > 40)
			        	col = '#7fcdbb';
			        else if (y > 30)
			        	col = '#c7e9b4';
			        else if (y > 20)
			        	col = '#edf8b1';
			        layer.setStyle({'fillOpacity': 0.7, 'fillColor': col});
			        var content = "Unique: "+x[k][0]+"<br/>Volume: "+x[k][1]+"<br/>Temp.Sig.: "+x[k][2]+"<br/><b>Weighted: "+Math.round(weighted*100)/100+"</b>";
			        layer.setTooltipContent(content);
			    } 
			})
 		}
 	}
 }

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



// lBerlin.getLayers()[0].feature.properties.hexid