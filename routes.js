const fs = require("fs");

const requestHandler = (req, res) => {
  const method = req.method;
  const url = req.url;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='messageTxt' /><button>Submit</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    // Listening to a stream of data coming from client
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    // At the end of request we listen to the end event
    // and work with Buffer Data received from data event from above function.
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      // On LHS of parsedBody log statement we have messageTxt
      // which comes from the form when submitted
      const data = parsedBody.split("=")[1];
      // writeFileSync blocks the code execution until the file is written
      // fs.writeFileSync("message.txt", data);
      fs.writeFile("message.txt", data, (err) => {
        // 302 is the redirection HTTP status code
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  /* 
  Default fallback for any other routes except for / route
  */
  //   console.log(req.url, req.method, req.headers);
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");
  res.end();
  //   If we start writing after ending the response it will result in error
};

module.exports = requestHandler;
