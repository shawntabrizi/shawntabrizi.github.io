---
title: Combining Rocket with Reqwest to Call an API with Rust
date: 2018-10-21T19:28:05-08:00
authors: shawntabrizi
layout: post
slug: /code/combining-rocket-with-reqwest-to-call-an-api-with-rust/
categories:
  - Code
tags:
  - programming
  - reqwest
  - rocket
  - rust
---

##### This post will be a short code snippet to show how you can combine the [_Dynamic Segments_ example from Rocket](https://rocket.rs/guide/requests/#dynamic-segments) and the [_Calling a Web API_ example from the Rust Cookbook](https://rust-lang-nursery.github.io/rust-cookbook/web/clients/apis.html).

I wanted to start playing around with Rust, so I was given a project to build a web application which would interact with downstream apis and present a simple user interface. Unfortunately, it seems that some of these common use cases are not easily documented for new users like me!

Let’s fix that 🙂

## Creating a simple webpage in Rust

We will create a simple webpage which will call a downstream API, and return a result on the page. We will be using Rocket as our web framework and Reqwest as our HTTP client since Rocket only provides an HTTP server.

Our example will follow exactly the basic examples from these two sources, but combine them to work together in an easy to understand way.

The Rocket tutorial shows you how you can set up dynamic segments to be able to allow your program to accept a path segment as a variable in your function. In the tutorial we use this to be able to say “Hello, NAME”. The Reqwest tutorial shows you how you can check if a certain user exists on GitHub by querying their GitHub Users Endpoint using a HEAD request.

So let’s combine this to create a site where you can navigate to `/check/<username>` and it will tell you if the user exists on GitHub or not!

I won’t be diving into the code line by line, since you can read from the tutorials what the different pieces do, but I do want to give you a working code snippet which does just what I said:

### Cargo.toml

```
…
[dependencies]
rocket = “0.3.17”
rocket_codegen = “0.3.17”
reqwest = “0.9.3”
```

### src/main.rs

```rust
#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate reqwest;
extern crate rocket;

use rocket::http::RawStr;

use std::time::Duration;
use reqwest::ClientBuilder;


#[get("/")]
fn index() -> &'static str {
    "Navigate to http://localhost:8000/check/<type your GitHub name here> to check that everything is working!"
}

#[get("/check/<user>")]
fn check(user: &RawStr) -> Result<String, Box<std::error::Error>> {
    let request_url = format!("https://api.github.com/users/{}", user);

    let timeout = Duration::new(5, 0);
    let client = ClientBuilder::new().timeout(timeout).build()?;
    let response = client.head(&request_url).send()?;

    if response.status().is_success() {
        Ok(format!("{} is a user!", user))
    } else {
        Ok(format!("{} is not a user!", user))
    }
}

fn main() {
    rocket::ignite().mount("/", routes![index, check]).launch();
}
```

## Testing your webpage

After you have copied these items into your project, you can simply run `cargo run` to spin up your local web server.

![](/assets/images/img_5bcd419da1b02.png)

The index page at `http://localhost:8000/` will tell you to navigate to `http://localhost:8000/check/<username>` where you should fill in the GitHub username you want to check. For me, this is: `http://localhost:8000/check/shawntabrizi`, which gives me the following confirmation!

![](/assets/images/img_5bcd41b64c8db.png)

If I use a username which doesn't exist like `http://localhost:8000/check/shawnfabreezy`, again I get the expected message:

![](/assets/images/img_5bcd41cdc9c8e.png)

## More to come!

I hope that you found this little tutorial helpful. Getting started with Rust can be a little frustrating due to many compile time checks which occur, but sometimes you just need some running code to really get started. If you want to support this blog and other posts like this, feel free to check out [my donations page](/donate/).
