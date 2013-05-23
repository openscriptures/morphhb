<?php
/**
 * DataPass holds username and password for the databgase.
 *
 * @author troidl
 */
class DataPass
{
    private static $user = 'username';
    private static $pass = 'password';

    static function User()
    {
        return self::$user;
    }

    static function Pass()
    {
        return self::$pass;
    }
}
?>