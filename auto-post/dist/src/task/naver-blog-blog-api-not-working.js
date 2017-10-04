var apiUrl = 'http://api.blog.naver.com/xmlrpc';
var username = 'fulljebi';
var password = '2ba5d640e614f5616011b0736a3fea51';
var blogId = 1;
var tag = '필리핀,마닐라';
var date = new Date().toISOString().slice(0, 19);
var body = "\n<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<methodCall> \n<methodName>metaWeblog.newPost</methodName> \n<params> \n<param> \n<value> \n<string>" + blogId + "</string> \n</value> \n</param> \n<param> \n<value>" + username + "</value> \n</param> \n<param> \n<value> \n<string>" + password + "</string> \n</value> \n</param> \n<param> \n<struct> \n<member> \n<name>categories</name> \n<value> \n<array> \n<data> \n<value>" + tag + "</value> \n</data> \n</array> \n</value> \n</member> \n<member> \n<name>description</name> \n<value>Dr. Quest is missing while on an expedition to find the Yeti. Jonny and his friends head to the Himalayas to find him, but run into another scientist who's determined to bring back the Yeti.\n</value>\n</member> \n<member> \n<name>title</name> \n<value>Expedition To Khumbu</value> \n</member> \n<member> \n<name>dateCreated</name> \n<value>\n<dateTime.iso8601>" + date + "</ dateTime.iso8601> \n</value> \n</member> \n</struct> \n</param> \n<param>\n <value>\n  <boolean>1</boolean>\n </value>\n</param> \n</params> \n</methodCall>\n";
var http = require('http');
var postRequest = {
    host: "api.blog.naver.com",
    path: "/xmlrpc",
    port: 443,
    method: "POST",
    headers: {
        'Content-Type': 'text/xml',
        'Content-Length': Buffer.byteLength(body)
    }
};
var buffer = "";
var req = http.request(postRequest, function (res) {
    console.log(res.statusCode);
    var buffer = "";
    res.on("data", function (data) { buffer = buffer + data; });
    res.on("end", function (data) { console.log(buffer); });
});
req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});
req.write(body);
req.end();
//# sourceMappingURL=naver-blog-blog-api-not-working.js.map