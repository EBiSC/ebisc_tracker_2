package api

import (
    "gopkg.in/mgo.v2"
    "labix.org/v2/mgo/bson"
    "time"
    "net/url"
    "strconv"
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

func moduleHandlerFn(vars map[string]string, form url.Values, session *mgo.Session) *apiResponse{
  c := session.DB("ebisc").C("test_fail")
  dateStr := form.Get("date")
  if len(dateStr) == 0 {
    return newBadRequestRes("Date required as a query parameter")
  }
  queryParams := bson.M{"module": vars["module"]};
  if date, err := time.Parse(time.RFC3339Nano, dateStr); err != nil {
    return newBadRequestRes("Date not valid RFC3339Nano")
  } else {
    queryParams["date"] = date
  }
  query := c.Find(queryParams);
  m := bson.M{}

  if n, err := query.Count(); err != nil {
    panic(newApiError(err, "Database error"))
  } else {
    m["total"] = n
  }

  query = query.Sort("_id").Limit(100).Select(bson.M{"_id": 0})

  if skipStr := form.Get("offset"); len(skipStr) > 0 {
    if skip, err := strconv.Atoi(skipStr); err != nil{
      return newBadRequestRes("skip not a valid integer")
    } else {
      query = query.Skip(skip)
      m["page_offset"] = skip
    }
  } else {
    m["page_offset"] = 0
  }

  if limitStr := form.Get("limit"); len(limitStr) > 0 {
    if limit, err := strconv.Atoi(limitStr); err != nil{
      return newBadRequestRes("limit not a valid integer")
    } else {
      m["page_limit"] = limit
      query = query.Limit(limit)
    }
  } else {
    m["page_limit"] = 100
    query = query.Limit(100)
  }

  var items []interface{}
  if err := query.All(&items); err != nil {
    panic(newApiError(err, "Database find error"))
  }
  m["items"] = items
  m["error"] = false
  return newOKRes(m)
}


