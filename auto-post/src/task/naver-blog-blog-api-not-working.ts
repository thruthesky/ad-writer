
const apiUrl = 'http://api.blog.naver.com/xmlrpc'; // use your blog API instead
const username = 'fulljebi';
const password = '2ba5d640e614f5616011b0736a3fea51';
const blogId = 1;

const tag = '필리핀,마닐라';
const date = new Date().toISOString().slice(0, 19);


const body = `
<?xml version="1.0" encoding="utf-8"?>
<methodCall> 
<methodName>metaWeblog.newPost</methodName> 
<params> 
<param> 
<value> 
<string>${blogId}</string> 
</value> 
</param> 
<param> 
<value>${username}</value> 
</param> 
<param> 
<value> 
<string>${password}</string> 
</value> 
</param> 
<param> 
<struct> 
<member> 
<name>categories</name> 
<value> 
<array> 
<data> 
<value>${tag}</value> 
</data> 
</array> 
</value> 
</member> 
<member> 
<name>description</name> 
<value>Dr. Quest is missing while on an expedition to find the Yeti. Jonny and his friends head to the Himalayas to find him, but run into another scientist who's determined to bring back the Yeti.
</value>
</member> 
<member> 
<name>title</name> 
<value>Expedition To Khumbu</value> 
</member> 
<member> 
<name>dateCreated</name> 
<value>
<dateTime.iso8601>${date}</ dateTime.iso8601> 
</value> 
</member> 
</struct> 
</param> 
<param>
 <value>
  <boolean>1</boolean>
 </value>
</param> 
</params> 
</methodCall>
`;


const http = require('http');

let postRequest = {
    host: "api.blog.naver.com",
    path: "/xmlrpc",
    port: 443,
    method: "POST",
    headers: {
        'Content-Type': 'text/xml',
        'Content-Length': Buffer.byteLength(body)
    }
};

let buffer = "";

let req = http.request(postRequest, function (res) {

    console.log(res.statusCode);
    let buffer = "";
    res.on("data", function (data) { buffer = buffer + data; });
    res.on("end", function (data) { console.log(buffer); });

});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

req.write(body);

req.end();
