<?php

namespace Leyelectoral;

use Silex\Application;
use Silex\ExtensionInterface;
error_reporting(E_ALL);


class MongoExtension implements ExtensionInterface
{
    public function register(Application $app)
    {
        $app['db.options'] = array_replace(array(
            'db' => 'elecciones',
            'collection' => 'elecciones',
        ), isset($app['db.options']) ? $app['db.options'] : array());

        $app['db'] = $app->protect(function () use ($app){
            $connection = new \Mongo();
            $db = $connection->{$app['db.options']['db']};
            $collection = $db->{$app['db.options']['collection']};
            return $collection;
        });

    }
}
