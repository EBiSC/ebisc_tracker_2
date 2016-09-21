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
}

func (e *apiError) Error() string {
  return e.error.Error()
}

func newOKRes(c interface{}) *apiResponse{
  return &apiResponse{c, http.StatusOK}
}

func newErrorRes(message string, code int) *apiResponse {
  content := map[string]interface{}{
        "error": true,
        "message": message,
      }
  return &apiResponse{content, code}
}

func newApiError(e interface{}, m string) *apiError {
  return &apiError{errors.Wrap(e, 1), m}
}

func newBadRequestRes(m string) *apiResponse {
  return newErrorRes(m, http.StatusBadRequest)
}

func newNotFoundRes() *apiResponse {
  return newErrorRes("Not found", http.StatusNotFound)
}

type apiResponse struct {
  content interface{}
  code int
}

type apiHandlerFn func(map[string]string, url.Values, *mgo.Session) *apiResponse
type apiHandler struct {
  fn apiHandlerFn
  db *mgo.Session
}

func notFoundHandlerFn(vars map[string]string, form url.Values, db *mgo.Session) *apiResponse{
  return newNotFoundRes()
}

func (h *apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  ch := make(chan *apiResponse)
  go func() {
    defer handleError(ch)
    session := h.db.Copy()
    defer session.Close()
    vars := mux.Vars(r)
    if err := r.ParseForm(); err != nil {
      panic(newApiError(err, "Form parse error"))
    }
    ch <- h.fn(vars, r.Form, session)
  }()
  res := <-ch
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(res.code)
  if err := json.NewEncoder(w).Encode(res.content); err != nil {
    panic(err);
  }
}

func handleError(ch chan<- *apiResponse) {
  if r := recover(); r != nil {
    var apiErr *apiError
    var ok bool
    if apiErr, ok = r.(*apiError); !ok {
      apiErr = newApiError(r, "Server error")
    }
    log.Println(apiErr.error.ErrorStack())
    ch <- newErrorRes(apiErr.message, http.StatusInternalServerError)
  }
}
