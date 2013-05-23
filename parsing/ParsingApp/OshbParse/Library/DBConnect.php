<?php
#****************************************************************************************************************************
# DBConnect Class ---  MySQLI Database Connection Class
#****************************************************************************************************************************
class DBConnect extends MySQLi
{
private $host;          # MySQL server hostname
private $username;      # MySQL username
private $passwd;        # MySQL user's password
private $dbname;        # Name of database to use

function isError()      # check for MySQL errors
{ if ($this->connect_error)     return true;
  if ($this->error)             return true;
  return(false);
}

public function __construct($host="", $username="", $passwd="", $dbname=""/*, $newlink=false */) 
{ $this->host       = $host     ? $host     : ini_get("mysql.default_host");
  $this->username   = $username ? $username : ini_get("mysql.default_user");
  $this->passwd     = $passwd   ? $passwd   : ini_get("mysql.default_password");
  $this->dbname     = $dbname   ? $dbname   : "hb";

  parent::__construct($this->host, $this->username, $this->passwd, $this->dbname);
  if ($this->connect_errno) die('Connect Error ('. $this->connect_errno . ') ' . $this->connect_error);
}

function dbquery($sql)              # returns an instance of DBResult to fetch rows with
{ if (! ($result = $this->query($sql))) die('Query failed: '.$this->error.' SQL: '.$sql);
  return($result); 
}

} # END CLASS DBConnect
 
?>
