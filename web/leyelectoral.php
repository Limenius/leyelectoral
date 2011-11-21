<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__.'/../silex.phar';
require_once __DIR__.'/../MongoDb.php';
require_once __DIR__.'/../parties.php';
require_once __DIR__.'/../markdown.php';

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

$app = new Silex\Application();
$app['parties'] = $parties;
$app['colors']  = $colors;
$app['parties2011'] = $parties2011;
$app['colors2011']  = $colors2011;
$app['content_dir'] = __DIR__.'/../content/';

$staticPage = function($page, $explanations) {
    return $page;
};

$app->register(new Silex\Extension\TwigExtension(), array(
    'twig.path'       => __DIR__.'/../views',
    'twig.class_path' => __DIR__.'/../vendor/twig/lib',
));

$app->register(new Leyelectoral\MongoExtension(), array(
    'db.options' => array('db'=>'elecciones', 'collection'=>'provincias', 'db1'=>'elecciones', 'collection1'=>'provincias2011'),
));

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
        $explanations[str_replace(".md","" , $file)] = Markdown($fcontent);
    }

    $escapedFragment = $app['request']->get('_escaped_fragment_');

    if ($escapedFragment) {
    return $staticPage($escapedFragment, $explanations);}


    $db = $app['db']();
    $cursor = $db->find();
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

$app->get('/', function () use ($app, $staticPage) {
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
        $explanations[str_replace(".md","" , $file)] = Markdown($fcontent);
    }

    $escapedFragment = $app['request']->get('_escaped_fragment_');

    if ($escapedFragment) {
    return $staticPage($escapedFragment, $explanations);}


    $db = $app['db1']();
    $cursor = $db->find();
    $votes = array();
    $content = array();
    foreach ($cursor as $row) {
        $votes[$row['Provincia']] = array_slice($row, 13);
        $content[$row['Provincia']] = array_slice($row, 7, 6);

    }
    return $app['twig']->render('main2011.twig', array(
        'parties'      => $app['parties'],
        'colors'       => $app['colors'],
        'stats'        => $content,
        'votes'        => $votes,
        'explanations' => $explanations
    ));
});

$app->error(function (\Exception $e) {
    if ($e instanceof NotFoundHttpException) {
        return new Response('La página que buscas no está aquí.', 404);
    }

    $code = ($e instanceof HttpException) ? $e->getStatusCode() : 500;
    return new Response('Algo ha fallado en nuestra sala de máquinas.', $code);
});

$app->run();
