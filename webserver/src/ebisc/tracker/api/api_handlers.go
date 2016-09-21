package api

import (
    "gopkg.in/mgo.v2"
    "labix.org/v2/mgo/bson"
    "time"
    "net/url"
)
func testHandlerFn(vars map[string]string, form url.Values, db *mgo.Session) *apiResponse{
  res := map[string]interface{}{
    "error": false,
    "text": "this is a test",
  }
  return newOKRes(res)
}

func codeRunHandlerFn(vars map[string]string, form url.Values, session *mgo.Session) *apiResponse{

  c := session.DB("ebisc").C("code_run")
  m := make(bson.M)
  if dateStr := vars["date"]; len(dateStr) > 0 {
    if date, err := time.Parse(time.RFC3339Nano, dateStr); err != nil {
      return newBadRequestRes("Date not valid RFC3339Nano")
    } else {
      if err := c.Find(bson.M{"date": date}).One(&m); err != nil {
        if (err == mgo.ErrNotFound) {
          return newNotFoundRes()
        }
        panic(newApiError(err, "Database find error"))
      }
    }
  } else {
    if err := c.Find(nil).Sort("-date").One(&m); err != nil {
      panic(newApiError(err, "Database find error"))
    }
  }

  if modules, ok := m["modules"].([]interface{}); ok {
    for _, module := range modules {
      expandModule(&module, session)
    }
  }

  delete(m, "_id")
  m["error"] = false
  
  return newOKRes(m)
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
    if (err == mgo.ErrNotFound) {
      return // Not an error
    }
    panic(newApiError(err, "Database find error"))
  }
  for key, val := range expandedModule {
    oldModule[key] = val
  }

}

func codeRunListHandlerFn(vars map[string]string, form url.Values, session *mgo.Session) *apiResponse{
  c := session.DB("ebisc").C("code_run")
  var query bson.M = nil
  if dateStr := form.Get("date"); len(dateStr) > 0 {
    if date, err := time.Parse(time.RFC3339Nano, dateStr); err != nil {
      return newBadRequestRes("Date not valid RFC3339Nano")
    } else {
      query = bson.M{"date": bson.M{"$lt": date}};
    }
  }
  var items []interface{}
  if err := c.Find(query).Sort("-date").Limit(10).Select(bson.M{"date": 1, "_id": 0}).All(&items); err != nil {
    panic(newApiError(err, "Database find error"))
  }
  m := bson.M{"items": items, "error": false}
  return newOKRes(m)
}
