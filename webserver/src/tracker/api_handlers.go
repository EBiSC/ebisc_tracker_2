package main

import (
    "encoding/json"
    "net/http"
    "gopkg.in/mgo.v2"
)

type apiHandler func(r *http.Request) (error, interface{})

func (fn apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  err, res := fn(r)
  if err != nil {
    http.Error(w, err.Error(), 500)
  } else {
    w.Header().Set("Content-Type", "application/json; charset=UTF-8")
    w.WriteHeader(http.StatusOK)
    if err := json.NewEncoder(w).Encode(res); err != nil {
      panic(err);
    }
  }
}

func testHandlerFn(r *http.Request) (error, interface{}){
  res := map[string]interface{}{
    "error": false,
    "text": "this is a test",
  }
  return nil, res
}

func codeRunHandlerFn(r *http.Request) (error, interface{}){
  var res interface{}

  session, err := mgo.Dial("mongodb://ebisc:ebisc@mongodb/ebisc")
  if err != nil {
    return err, nil
  }
  defer session.Close()

  c := session.DB("ebisc").C("code_run")
  err = c.Find(nil).Sort("-date").One(&res)
  return err, res
}
