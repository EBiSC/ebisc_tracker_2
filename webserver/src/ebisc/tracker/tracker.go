package main

import (
    "log"
    "net/http"
    "time"
    "flag"
    "github.com/gorilla/mux"

    "ebisc/tracker/api"
    "ebisc/tracker/angular"
)

func main() {
  var dbhost, dir string
  var apiConfig api.Config

  flag.StringVar(&dir, "dir", "/usr/src/myapp", "the directory to serve files from. Defaults to /usr/src/myapp")
  flag.StringVar(&dbhost, "dbhost", "mongodb", "mongodb host name. Defaults to mongodb")
  flag.StringVar(&apiConfig.Username, "dbuser", "ebisc", "mongodb user name. Defaults to ebisc")
  flag.StringVar(&apiConfig.Password, "dbpass", "ebisc", "mongodb password. Defaults to ebisc")
  flag.StringVar(&apiConfig.Database, "dbname", "ebisc", "mongodb database name. Defaults to ebisc")
  flag.Parse()

  apiConfig.Addrs = []string{dbhost}

  r := mux.NewRouter()

  api.AddHandlers(r, &apiConfig)
  angular.AddHandlers(r, dir)


  srv := &http.Server{
    Handler: r,
    Addr: ":8000",
    WriteTimeout: 15 * time.Second,
    ReadTimeout:  15 * time.Second,
    // MaxHeaderBytes: 1 << 20, // Default
    // ErrorLog: 
  }

  log.Fatal(srv.ListenAndServe())

}

