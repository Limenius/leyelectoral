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
if (($handle = fopen("02_200803_1.csv", "r")) !== FALSE) {
    $data = fgetcsv($handle, 2000, ",");
    $num = count($data);
    $partidos = array();
    for ($c=13; $c < $num; $c++) {
        $partidos[$c] = normalize(trim($data[$c]));
        echo "\"$partidos[$c]\" => \"$data[$c]\",\n";
    }
    while (($data = fgetcsv($handle, 2000, ",")) !== FALSE) {
        $num = count($data);
        $row++;
        $result = array(
            'Elecciones' => 'Generales 2008',
            'Comunidad'  => trim($data[0]),
            'Provincia'  => trim($data[2]),
            'Municipio'  => trim($data[4]),
            'Población' =>  uncommize(trim($data[5])),
            'Mesas'      => uncommize(trim($data[6])),
            'Censo'      => uncommize(trim($data[7])),
            'Votantes'   => uncommize(trim($data[8])),
            'Válidos'    => uncommize(trim($data[9])),
            'VCandidaturas' => uncommize(trim($data[10])),
            'VBlanco'    => uncommize(trim($data[11])),
            'VNulos'     => uncommize(trim($data[12])),
        );
        for ($c=13; $c < $num; $c++) {
            $result[$partidos[$c]] = uncommize(trim($data[$c]));
        }
        $connection = new Mongo();
        $db = $connection->elecciones;
        $collection = $db->elecciones;
        $collection->save($result);

    }
    fclose($handle);
}
?>

