package main

import (
    //"fmt"
    "log"
    "gopkg.in/mgo.v2"
    "net/http"
    "time"
    "flag"

    "github.com/gorilla/mux"
)

func main() {
  var dir string

  flag.StringVar(&dir, "dir", ".", "the directory to serve files from. Defaults to the current dir")
  flag.Parse()

  r := mux.NewRouter()
  r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(dir))))

  session, err := mgo.Dial("mongodb://ebisc:ebisc@mongodb/ebisc")
  if err != nil {
    panic(err)
  }

  api := r.PathPrefix("/api").Subrouter()
  api.Handle("/test", &apiHandler{testHandlerFn, session});
  api.Handle("/code_run", &apiHandler{codeRunHandlerFn, session});

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

