package main

import (
    "encoding/json"
    "net/http"
    "gopkg.in/mgo.v2"
    "github.com/go-errors/errors"
    "fmt"
)

type apiError struct {
  error *errors.Error
  message string
  code int
}

type apiHandler func(r *http.Request) (*apiError, interface{})

func (fn apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  err, res := fn(r)
  if err != nil {
    http.Error(w, err.message, err.code)
    fmt.Println(err.error.ErrorStack())
    return
  }
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
  if err := json.NewEncoder(w).Encode(res); err != nil {
    panic(err);
  }
}

func testHandlerFn(r *http.Request) (*apiError, interface{}){
  res := map[string]interface{}{
    "error": false,
    "text": "this is a test",
  }
  return nil, res
}

func codeRunHandlerFn(r *http.Request) (*apiError, interface{}){
  var res interface{}

  session, err := mgo.Dial("mongodb://ebisc:ebisc2@mongodb/ebisc")
  if err != nil {
    return &apiError{errors.Wrap(err, 0), "Database connect error", 500}, nil
  }
  defer session.Close()

  c := session.DB("ebisc").C("code_run")
  if err = c.Find(nil).Sort("-date").One(&res); err != nil {
    return &apiError{errors.Wrap(err, 1), "Database find error", 500}, nil
  }
  return nil, res
}
