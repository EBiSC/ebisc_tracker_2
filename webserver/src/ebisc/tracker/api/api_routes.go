package api

var endpoints = []endpoint{
  {
    "/test",
    testHandlerFn,
    nil,
  },
  {
    "/exams",
    examListHandlerFn,
    apiOpts{"date": tDATE},
  },
  {
    "/exams/latest",
    examHandlerFn,
    nil,
  },
  {
    "/exams/{date}",
    examHandlerFn,
    apiOpts{"date": tDATE},
  },
  {
    "/exams/{date}/fails",
    failHandlerFn,
    apiOpts{"date": tDATE, "limit": tINT, "offset": tINT, "cell_line": tSTR, "batch": tSTR, "module": tSTR},
  },
  {
    "/exams/{date}/line_fails",
    lineFailHandlerFn,
    apiOpts{"date": tDATE, "limit": tINT, "offset": tINT, "module": tSTR},
  },
}

