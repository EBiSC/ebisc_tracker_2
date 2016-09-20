package api

import (
    "net/http"
    "gopkg.in/mgo.v2"
    "github.com/go-errors/errors"
    "labix.org/v2/mgo/bson"
    "sync"
)

func testHandlerFn(res *apiContent, r *http.Request, db *mgo.Session) *apiError{
  *res = map[string]interface{}{
    "error": false,
    "text": "this is a test",
  }
  return nil
}

func codeRunHandlerFn(res *apiContent, r *http.Request, session *mgo.Session) *apiError{

  c := session.DB("ebisc").C("code_run")
  m := make(bson.M)
  if err := c.Find(nil).Sort("-date").One(&m); err != nil {
    return &apiError{errors.Wrap(err, 1), "Database find error", 500}
  }

  if modules, ok := m["modules"].([]interface{}); ok {
    var wg sync.WaitGroup
    wg.Add(len(modules))
    for i, _ := range modules {
      go func(i int) {
        defer wg.Done()
        expandModule(&modules[i], session)
      }(i)
    }
    wg.Wait()
  }

  delete(m, "_id")
  
  *res = m
  return nil
}

func expandModule(m *interface{}, session *mgo.Session) {
  module, ok := (*m).(bson.M)
  if (!ok) {
    return
  }
  newM := make(bson.M)
  c := session.DB("ebisc").C("test_module")
  if err := c.Find(bson.M{"module": module["module"]}).One(&newM); err != nil {
    return
  }
  for key, val := range newM {
    module[key] = val
  }

}
