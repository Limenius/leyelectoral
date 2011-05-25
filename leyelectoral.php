<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__.'/silex.phar';
require_once __DIR__.'/MongoDb.php';

$app = new Silex\Application();

$app->register(new Silex\Extension\MongoExtension(), array(
    'db.options' => array('db'=>'elecciones', 'collection'=>'elecciones'),
));

$app->get('/', function () use ($app) {
    $name = $app['request']->get('name');

    $db = $app['db']();
    $cursor = $db->find(array("Municipio" => "Barcelona"));
    return print_r($cursor->getNext(), true);
});


$app->run();
