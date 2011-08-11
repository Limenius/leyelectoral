<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__.'/silex.phar';
require_once __DIR__.'/MongoDb.php';
require_once __DIR__.'/parties.php';

$app = new Silex\Application();
$app['parties'] = $parties;
$app['colors']  = $colors;

$app->register(new Silex\Extension\TwigExtension(), array(
    'twig.path'       => __DIR__.'/views',
    'twig.class_path' => __DIR__.'/vendor/twig/lib',
));

$app->register(new Leyelectoral\MongoExtension(), array(
    'db.options' => array('db'=>'elecciones', 'collection'=>'provincias'),
));

$app->get('/', function () use ($app) {
    $name = $app['request']->get('name');

    $db = $app['db']();
    $cursor = $db->find();
    $votes = array();
    $content = array();
    foreach ($cursor as $row) {
        $votes[$row['Provincia']] = array_slice($row, 13);
        $content[$row['Provincia']] = array_slice($row, 7, 6);

    }
    return $app['twig']->render('main.twig', array(
        'parties' => $app['parties'],
        'colors'  => $app['colors'],
        'stats'   => $content,
        'votes'   => $votes,
    ));
});

$app->run();
