package main

import (
    "encoding/json"
    "net/http"
    "github.com/go-errors/errors"
    "fmt"
)

type apiError struct {
  error *errors.Error
  message string
  code int
}

type apiContent interface{}

type apiHandler func(*apiContent, *http.Request) *apiError

func (fn apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  var res apiContent
  if err := fn(&res, r); err != nil {
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
