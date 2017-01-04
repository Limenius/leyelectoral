<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/../parties.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Lalbert\Silex\Provider\MongoDBServiceProvider;
use \Michelf\Markdown;

$app = new Silex\Application();
$app['debug'] = true;
$app['parties'] = $parties;
$app['colors']  = $colors;
$app['parties2011'] = $parties2011;
$app['colors2011']  = $colors2011;
$app['content_dir'] = __DIR__.'/../content/';

$staticPage = function($page, $explanations) {
    return $page;
};

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
));

$app->register(new MongoDBServiceProvider(), [
    'mongodb.config' => [
        'server' => 'mongodb://localhost:27017',
        'options' => [],
        'driverOptions' => [],
    ]
]);

//$app->register(new Leyelectoral\MongoServiceProvider(), array(
//    'db.options' => array('db'=>'elecciones', 'collection'=>'provincias', 'db1'=>'elecciones', 'collection1'=>'provincias2011'),
//));

$app->get('/resultados2008', function () use ($app, $staticPage) {
    $explanations  = array();
    $files = array();
    if ($handle = opendir($app['content_dir'].'/short')) {
        while (false !== ($file = readdir($handle))) {
            if ($file != "." && $file != "..") {
                array_push($files, $file);
            }
        }
        closedir($handle);
    }

    foreach($files as $file){
        $fcontent = file_get_contents($app['content_dir'].'/short/'.$file);
        $explanations[str_replace(".md","" , $file)] = Markdown::defaultTransform($fcontent);
    }

    $escapedFragment = $app['request']->get('_escaped_fragment_');

    if ($escapedFragment) {
    return $staticPage($escapedFragment, $explanations);}

    $cursor = $app['mongodb']
        ->elecciones
        ->provincias
        ->find();

    $votes = array();
    $content = array();
    foreach ($cursor as $row) {
        $votes[$row['Provincia']] = array_slice($row, 13);
        $content[$row['Provincia']] = array_slice($row, 7, 6);

    }
    return $app['twig']->render('main.twig', array(
        'parties'      => $app['parties'],
        'colors'       => $app['colors'],
        'stats'        => $content,
        'votes'        => $votes,
        'explanations' => $explanations
    ));
});

$app->get('/{page}', function ($page) use ($app) {
    return $app['twig']->render($page.'.twig', array(
    ));
});

$app->get('/', function (Request $request) use ($app, $staticPage) {
    $explanations  = array();
    $files = array();
    if ($handle = opendir($app['content_dir'].'/short')) {
        while (false !== ($file = readdir($handle))) {
            if ($file != "." && $file != "..") {
                array_push($files, $file);
            }
        }
        closedir($handle);
    }

    foreach($files as $file){
        $fcontent = file_get_contents($app['content_dir'].'/short/'.$file);
        $explanations[str_replace(".md","" , $file)] = Markdown::defaultTransform($fcontent);
    }

    $escapedFragment = $request->get('_escaped_fragment_');

    if ($escapedFragment) {
    return $staticPage($escapedFragment, $explanations);}


    $cursor = $app['mongodb']
        ->elecciones
        ->provincias2011
        ->find();

    $votes = array();
    $content = array();
    foreach ($cursor as $row) {
        $votes[$row['Provincia']] = array_slice($row, 13);
        $content[$row['Provincia']] = array_slice($row, 7, 6);

    }
    return $app['twig']->render('main2011.twig', array(
        'parties'      => $app['parties2011'],
        'colors'       => $app['colors2011'],
        'stats'        => $content,
        'votes'        => $votes,
        'explanations' => $explanations
    ));
});

//$app->error(function (\Exception $e) {
//    if ($e instanceof NotFoundHttpException) {
//        return new Response('La página que buscas no está aquí.', 404);
//    }
//
//    $code = ($e instanceof HttpException) ? $e->getStatusCode() : 500;
//    return new Response('Algo ha fallado en nuestra sala de máquinas.', $code);
//});

$app->run();
