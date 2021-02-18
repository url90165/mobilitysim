<?php

	$data = file_get_contents('all_match2cities.json');
	$json = json_decode($data);
	$bdata = file_get_contents('stockholm.geojson');
	$berlin = json_decode($bdata);
	$arr = array();
	foreach($json->{'261'} as $k=>$j) {
		$arr[] = intval($k);
	}

	$g = array_unique($arr);

	$geojson = (Object)array();
	$geojson->type = 'FeatureCollection';
	$geojson->features = array();

	foreach($berlin->features as $v) {
		if (in_array($v->properties->hexid, $g)) {
			echo $v->properties->hexid . "\n";
			$geojson->features[] = $v;
		}
	}

	$file = fopen('stockholm_sub.geojson','w');
	fwrite($file, json_encode($geojson));
	fclose($file);

	//var_dump($g);

?>