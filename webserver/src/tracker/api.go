package main

import (
    "encoding/json"
    "net/http"
    "gopkg.in/mgo.v2"
    "github.com/go-errors/errors"
    "log"
    "fmt"
)

type apiError struct {
  error *errors.Error
  message string
  code int
}

type apiContent interface{}

type apiHandlerFn func(*apiContent, *http.Request, *mgo.Session) *apiError
type apiHandler struct {
  fn apiHandlerFn
  db *mgo.Session
}

type angularDir struct {
  dir string
}

func (dir angularDir) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  http.ServeFile(w, r, fmt.Sprintf("%s/index.html", dir.dir))
}


func (h *apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  var res apiContent
  session := h.db.Copy()
  defer session.Close()
  if err := h.fn(&res, r, session); err != nil {
    http.Error(w, err.message, err.code)
    log.Println(err.error.ErrorStack())
    return
  }
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
  if err := json.NewEncoder(w).Encode(res); err != nil {
    panic(err);
  }
}
