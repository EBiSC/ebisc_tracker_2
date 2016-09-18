package main

import (
    //"fmt"
    "log"
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

  api := r.PathPrefix("/api").Subrouter()
  api.HandleFunc("/test", TestHandler);

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

