<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__.'/silex.phar';
require_once __DIR__.'/MongoDb.php';
require_once __DIR__.'/parties.php';

$app = new Silex\Application();
$app['parties'] = $parties;

$app->register(new Silex\Extension\TwigExtension(), array(
    'twig.path'       => __DIR__.'/views',
    'twig.class_path' => __DIR__.'/vendor/twig/lib',
));

$app->register(new Leyelectoral\MongoExtension(), array(
    'db.options' => array('db'=>'elecciones', 'collection'=>'elecciones'),
));

$app->get('/', function () use ($app) {
    $name = $app['request']->get('name');

    $db = $app['db']();
    $cursor = $db->find(array("Municipio" => "Barcelona"));
    $row = $cursor->getNext();
    $votes = array_slice($row, 13);
    $content = array_slice($row, 7, 6);
    return $app['twig']->render('hello.twig', array(
        'parties' => $app['parties'],
        'stats'   => $content,
        'votes'   => $votes,
    ));
});

$app->get('/hello/{name}', function ($name) use ($app) {
    return $app['twig']->render('hello.twig', array(
        'name' => $name,
    ));
});


$app->run();
