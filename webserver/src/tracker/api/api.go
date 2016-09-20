package api

import (
    "encoding/json"
    "net/http"
    "gopkg.in/mgo.v2"
    "github.com/go-errors/errors"
    "log"
    //"fmt"
    "github.com/gorilla/mux"
)

type Config mgo.DialInfo

type apiError struct {
  error *errors.Error
  res apiContent
  code int
}

func (e *apiError) Error() string {
  return e.error.Error()
}

func newApiError(e interface{}, m string, code int) *apiError {
  res := map[string]interface{}{
    "error": true,
    "text": m,
  }
  return &apiError{errors.Wrap(e, 1), res, code}
}

type apiContent interface{}

type apiHandlerFn func(*http.Request, *mgo.Session) apiContent
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
  res := new(apiContent)
  defer writeResponse(w, res)
  session := h.db.Copy()
  defer session.Close()
  *res = h.fn(r, session)
}

func writeResponse(w http.ResponseWriter, res *apiContent) {
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  if r := recover(); r != nil {
    var apiErr *apiError
    var ok bool
    if apiErr, ok = r.(*apiError); !ok {
      apiErr = newApiError(r, "Server error", 500)
    }
    w.WriteHeader(apiErr.code)
    log.Println(apiErr.error.ErrorStack())
    *res = apiErr.res
  } else {
    w.WriteHeader(http.StatusOK)
  }
  if err := json.NewEncoder(w).Encode(*res); err != nil {
    panic(err);
  }
}
