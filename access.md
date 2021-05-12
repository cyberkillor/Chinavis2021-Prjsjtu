# Access plain text file

```css
div {
    white-space: pre-line;
}
```

```javascript
var headers = new Headers();
let username = "share";
let password = "123456";

headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
fetch("https://nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/201708/CN-Reanalysis-daily-2017083100.csv", {headers: headers})
    .then(r => r.text())
    .then(t => {
        document.querySelector("#test").innerHTML = t;
    })
```

https://nas.tonychen.page:5006/WebDavShare/ChinaVisa%202021%20Data/<file path>

Username: share
Password: 123456

e.g.
https://share:123456@nas.tonychen.page:5006/WebDavShare/ChinaVis%202021%20Data/201708/CN-Reanalysis-daily-2017083100.csv
