package api

import (
    "encoding/json"
    "net/http"
    "gopkg.in/mgo.v2"
    "github.com/go-errors/errors"
    "log"
    "github.com/gorilla/mux"
)

type Config mgo.DialInfo

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

func AddHandlers(r *mux.Router, dbInfo *Config) {
  session, err := mgo.DialWithInfo((*mgo.DialInfo)(dbInfo))
  if err != nil {
    panic(err)
  }
  api := r.PathPrefix("/api").Subrouter()
  api.Handle("/test", &apiHandler{testHandlerFn, session});
  api.Handle("/code_run/latest", &apiHandler{codeRunHandlerFn, session});
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
