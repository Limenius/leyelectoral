<?php

function normalize($text){
    $text = preg_replace('/\W+/', '-', $text);
    $text = strtolower(trim($text, '-'));
    return $text;
}
function uncommize($text){
    $text = preg_replace('/,/', '', $text);
    return $text;
}

$row = 1;

$provincias = array();

if (($handle = fopen("2011.csv", "r")) !== FALSE) {
    $data = fgetcsv($handle, 2000, ",");
    $num = count($data);
    $provincia_num = 00;
    $rows_counter = 0;
    $partidos = array();
    for ($c=0; $c < $num; $c++) {
        $partidos[$c] = normalize(trim($data[$c]));
        echo "\"$partidos[$c]\" => \"$data[$c]\",\n";
    }
    while (($data = fgetcsv($handle, 2000, ",")) !== FALSE) {
        $num = count($data);
        $row++;
        echo $rows_counter." ".$provincia_num." ".trim($data[1])."\n";
        if($provincia_num != trim($data[1])){
            $rows_counter = 0;
            $provincia_num = trim($data[1]);
            $result = array(
                'Elecciones' => 'Generales 2011',
                'Comunidad'  => trim($data[0]),
                'Provincia'  => trim($data[1]),
                'Municipio'  => null,
                'Población' =>  null,
                'Mesas'      => null,
                'VCandidaturas'      => null,
                'Mesas'      => null,
                'Censo'      => trim($data[4]),
                'Votantes'   => null,
                'Válidos'    => null,
                'VCandidaturas' => null,
                'VBlanco'    => null,
                'VNulos'     => null,
            );
            //echo $result['Provincia'].",\n";
            $rows_counter++;
        }else{
            if($rows_counter == 1){
                $result['Votantes'] = trim($data[4]);
            }else if($rows_counter == 2){
                $result['VNulos'] = trim($data[4]);
            }else if($rows_counter == 3){
                $result['Válidos'] = trim($data[4]);
            }else if($rows_counter == 4){
                $result['VBlanco'] = trim($data[4]);
                $provincias[$result['Provincia']] = unserialize(serialize($result));
                $c = 0;
            }else{
                $provincias[$result['Provincia']]['Población'] = null;
                $provincias[$result['Provincia']]['Mesas'] = null;
                $provincias[$result['Provincia']]['Censo'] = $result['Censo'];
                $provincias[$result['Provincia']]['Votantes'] = $result['Votantes'];
                $provincias[$result['Provincia']]['Válidos'] = $result['Válidos'];
                $provincias[$result['Provincia']]['VCandidaturas'] = 0;
                $provincias[$result['Provincia']]['VBlanco'] = $result['VBlanco'];
                $provincias[$result['Provincia']]['VNulos'] = $result['VNulos'];
                
                $result[$partidos[$c]] = uncommize(trim($data[4]));
                $provincias[$result['Provincia']][$partidos[$c]] = $result[$partidos[$c]];
                $c = $c+1;
                $connection = new Mongo();
                $db = $connection->elecciones;
                $collection = $db->elecciones2011;
                $collection->save($result);
                //echo $result['Censo'].",\n";
                //echo $result['Votantes'].",\n";
                //echo $result['VNulos'].",\n";
                //echo $result['Válidos'].",\n";
                //echo $result['VBlanco'].",\n";
                //echo $result['partido-popular-pp'].",\n";
            }
            $rows_counter++;
        }
    }

    foreach ($provincias as $provincia) {
        $collection = $db->provincias2011;
        $collection->save($provincia);
    }
    fclose($handle);
}
?>

