package api

import (
    "gopkg.in/mgo.v2"
    "labix.org/v2/mgo/bson"
)

func testHandlerFn(vars map[string]string, db *mgo.Session) apiContent{
  res := map[string]interface{}{
    "error": false,
    "text": "this is a test",
  }
  return res
}

func codeRunHandlerFn(vars map[string]string, session *mgo.Session) apiContent{

  c := session.DB("ebisc").C("code_run")
  m := make(bson.M)
  if err := c.Find(nil).Sort("-date").One(&m); err != nil {
    panic(newApiError(err, "Database find error"))
  }

  if modules, ok := m["modules"].([]interface{}); ok {
    for _, module := range modules {
      expandModule(&module, session)
    }
  }

  delete(m, "_id")
  
  return m
}

func expandModule(m *interface{}, session *mgo.Session) {
  var oldModule bson.M
  var ok bool
  if oldModule, ok = (*m).(bson.M); !ok {
    panic(newApiError("type conversion of module to a map", "Unexpected json structure"))
  }
  expandedModule := make(bson.M)
  c := session.DB("ebisc").C("test_module")
  if err := c.Find(bson.M{"module": oldModule["module"]}).One(&expandedModule); err != nil {
    panic(newApiError(err, "Database find error"))
  }
  for key, val := range expandedModule {
    oldModule[key] = val
  }

}
