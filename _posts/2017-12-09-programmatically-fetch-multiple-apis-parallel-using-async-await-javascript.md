---
id: 296
title: Programmatically fetch multiple APIs in parallel using async and await in JavaScript
date: 2017-12-09T03:13:44-08:00
author: Shawn Tabrizi
layout: post
guid: http://shawntabrizi.com/?p=296
permalink: /code/programmatically-fetch-multiple-apis-parallel-using-async-await-javascript/
categories:
  - Code
tags:
  - async
  - fetch
  - javascript
---
<p>When I was building <a href="http://shawntabrizi.com/ethfolio/">ethfolio</a>, I had to figure out how to retrieve the token information for multiple Ethereum addresses. To get this information, you have to query an API per address that you want to retrieve.</p>

<p>Ideally, all of these calls would happen Asynchronously and in parallel, to give the  best and fastest experience to the user. However, how exactly to do this is not so obvious (to me at least).</p>

<p>Let's assume that you have an array of URLs that you want to fetch at the same time. You can use an asynchronous function like this to easily retrieve all the data in the best way possible:</p>

```javascript
async function getAllUrls(urls) {
    try {
        var data = await Promise.all(
            urls.map(
                url =>
                    fetch(url).then(
                        (response) => response.json()
                    )));

        return (data)

    } catch (error) {
        console.log(error)

        throw (error)
    }
}
```

<p>This function will return an array of 'responses' which you can then use for the rest of your program. Calling the function is simple too!</p>


```javascript
var responses = await getAllUrls(urls)
```


<p>Ultimately the trick here is that a <code>Promise</code> gets executed as soon as it gets created. The <code>map</code> function will create all the <code>fetch</code> promises and they will immediately start to execute. Then, we wait for all the promises to complete using the <code>Promise.all</code> function.</p>

<p>I tried other ways to construct this kind of function, but none were quite as simple or effective as this. I hope you find this helpful :)</p>