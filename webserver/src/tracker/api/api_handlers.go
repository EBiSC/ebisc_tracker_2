package api

import (
    "net/http"
    "gopkg.in/mgo.v2"
    "labix.org/v2/mgo/bson"
    "sync"
)

func testHandlerFn(r *http.Request, db *mgo.Session) apiContent{
  res := map[string]interface{}{
    "error": false,
    "text": "this is a test",
  }
  return res
}

func codeRunHandlerFn(r *http.Request, session *mgo.Session) apiContent{

  c := session.DB("ebisc").C("code_run")
  m := make(bson.M)
  if err := c.Find(nil).Sort("-date").One(&m); err != nil {
    panic(newApiError(err, "Database find error", 500))
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
  
  return m
}

func expandModule(m *interface{}, session *mgo.Session) {
  var oldModule bson.M
  var ok bool
  if oldModule, ok = (*m).(bson.M); !ok {
    return
  }
  expandedModule := make(bson.M)
  c := session.DB("ebisc").C("test_module")
  if err := c.Find(bson.M{"module": oldModule["module"]}).One(&expandedModule); err != nil {
    return
  }
  for key, val := range expandedModule {
    oldModule[key] = val
  }

}
