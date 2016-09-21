package api

import (
    "encoding/json"
    "net/http"
    "net/url"
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

func (e *apiError) Error() string {
  if (e.error == nil) {
    return ""
  }
  return e.error.Error()
}

func (e *apiError) toApiContent() apiContent {
  return map[string]interface{}{
    "error": true,
    "text": e.message,
  }
}

func newApiError(e interface{}, m string) *apiError {
  return &apiError{errors.Wrap(e, 1), m, http.StatusInternalServerError}
}

func newBadRequest(m string) *apiError {
  return &apiError{nil, m, http.StatusBadRequest}
}

func newNotFound(m string) *apiError {
  return &apiError{nil, m, http.StatusNotFound}
}

type apiContent interface{}

type apiHandlerFn func(map[string]string, url.Values, *mgo.Session) apiContent
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
  api.Handle("/code_run", &apiHandler{codeRunListHandlerFn, session});
  api.Handle("/code_run/latest", &apiHandler{codeRunHandlerFn, session});
  api.Handle("/code_run/{date}", &apiHandler{codeRunHandlerFn, session});
}


func (h *apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  res := new(apiContent)
  defer writeResponse(w, res)
  session := h.db.Copy()
  defer session.Close()
  vars := mux.Vars(r)
  if err := r.ParseForm(); err != nil {
    panic(newApiError(err, "Form parse error"))
  }
  *res = h.fn(vars, r.Form, session)
}

func writeResponse(w http.ResponseWriter, res *apiContent) {
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  if r := recover(); r != nil {
    var apiErr *apiError
    var ok bool
    if apiErr, ok = r.(*apiError); !ok {
      apiErr = newApiError(r, "Server error")
    }
    w.WriteHeader(apiErr.code)
    if (apiErr.error != nil) {
      log.Println(apiErr.error.ErrorStack())
    }
    *res = apiErr.toApiContent()
  } else {
    w.WriteHeader(http.StatusOK)
  }
  if err := json.NewEncoder(w).Encode(*res); err != nil {
    panic(err);
  }
}
