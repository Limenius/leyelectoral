<?php

function normalize($text){
    $text = preg_replace('/\W+/', '-', $text);
    $text = strtolower(trim($text, '-'));
    return $text;
}

$row = 1;
if (($handle = fopen("02_200803_1.csv", "r")) !== FALSE) {
    $data = fgetcsv($handle, 2000, ",");
    $num = count($data);
    $partidos = array();
    for ($c=13; $c < $num; $c++) {
        $partidos[$c] = normalize(trim($data[$c]));
    }
    while (($data = fgetcsv($handle, 2000, ",")) !== FALSE) {
        $num = count($data);
        $row++;
        $result = array(
            'Elecciones' => 'Generales 2008',
            'Comunidad'  => trim($data[0]),
            'Provincia'  => trim($data[2]),
            'Municipio'  => trim($data[4]),
            'Población' =>  trim($data[5]),
            'Mesas'      => trim($data[6]),
            'Censo'      => trim($data[7]),
            'Votantes'   => trim($data[8]),
            'Válidos'    => trim($data[9]),
            'VCandidaturas' => trim($data[10]),
            'VBlanco'    => trim($data[11]),
            'VNulos'     => trim($data[12]),
        );
        for ($c=13; $c < $num; $c++) {
            $result[$partidos[$c]] = trim($data[$c]);
        }
        $connection = new Mongo();
        $db = $connection->elecciones;
        $collection = $db->elecciones;
        $collection->save($result);

    }
    fclose($handle);
}
?>

