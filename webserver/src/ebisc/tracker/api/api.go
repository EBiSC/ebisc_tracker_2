package api

import (
    "encoding/json"
    "net/http"
    "gopkg.in/mgo.v2"
    "github.com/go-errors/errors"
    "log"
    "github.com/gorilla/mux"
    "strconv"
    "fmt"
    "time"
)

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

func AddHandlers(r *mux.Router, dbInfo *Config) {
  session, err := mgo.DialWithInfo((*mgo.DialInfo)(dbInfo))
  if err != nil {
    panic(err)
  }
  api := r.PathPrefix("/api").Subrouter()
  for _, ep := range endpoints {
    api.Handle(ep.route, &apiHandler{ep.fn, ep.opts, session})
  }
  api.PathPrefix("/").Handler(&apiHandler{notFoundHandlerFn, nil, session});
}

func notFoundHandlerFn(vars apiVars, db *mgo.Session) *apiResponse{
  return newNotFoundRes()
}

func (h *apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  ch := make(chan *apiResponse)
  go func() {
    defer handleError(ch)
    session := h.db.Copy()
    defer session.Close()
    vars := mux.Vars(r)

    m := apiVars{}

    for oKey, oType := range h.opts {
      oValStr := vars[oKey]
      if len(oValStr) == 0 {
       oValStr = r.FormValue(oKey)
      }
      if len(oValStr) == 0 {
       continue
      }

      switch oType {
        case tSTR:
            m[oKey] = oValStr
        case tINT:
            var err error
            if m[oKey], err = strconv.Atoi(oValStr); err != nil{
              ch <- newBadRequestRes(fmt.Sprintf("%s not a valid integer", oKey))
              return
            }
        case tDATE:
            var err error
            if m[oKey], err = time.Parse(time.RFC3339Nano, oValStr); err != nil {
              ch <- newBadRequestRes(fmt.Sprintf("%s not a valid RFC3339Nano", oKey))
              return
            }
      }

    }

    ch <- h.fn(m, session)
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
