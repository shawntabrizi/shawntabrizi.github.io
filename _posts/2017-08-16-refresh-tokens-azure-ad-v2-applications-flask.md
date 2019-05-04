---
id: 181
title: Refresh Tokens for Azure AD V2 Applications in Flask
date: 2017-08-16T23:45:38-08:00
author: Shawn Tabrizi
layout: post
guid: http://shawntabrizi.com/?p=181
permalink: /aad/refresh-tokens-azure-ad-v2-applications-flask/
categories:
  - AAD
tags:
  - access token
  - authentication
  - azure active directory
  - flask
  - microsoft graph
  - python
  - refresh token
---
<p>I have been working on a few projects recently that used Flask, a Python web framework, and Azure Active Directory to do things related to the Microsoft Graph. Using <a href="https://flask-oauthlib.readthedocs.io/en/latest/">flask_oauthlib</a> and the<a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-appmodel-v2-overview"> Azure AD V2 endpoint</a>, it has been really easy to set up basic authentication for my web apps.</p>

<p>However, we quickly ran into basic authentication headaches like token expiry. It seems pretty obvious to the end user that as long as they haven't logged out since the last time they visited the site, they should stay automatically logged in. However, if you set up a naive implementation of authentication, you will find that the access token you store for the user is only valid for a limited time; <a href="https://docs.microsoft.com/en-us/azure/active-directory/active-directory-configurable-token-lifetimes">by default just 1 hour</a>.</p>

<p><strong>So do we make our user sign in every hour?</strong></p>
<p style="padding-left: 30px;">Hell no. We need to use refresh tokens which can be exchanged for NEW access tokens, all without the user being asked to sign in again.</p>

<p><strong>How do we get a refresh token?</strong></p>
<p style="padding-left: 30px;">In order to get a refresh token from the Azure AD V2 endpoint, you need to make sure your application requests a specific scope: offline_access. As stated <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-scopes#openid-connect-scopes">here</a>:</p>

<blockquote>
<p class="lf-text-block lf-block" style="padding-left: 60px;" data-lf-anchor-id="8fe12c1d59d9e6f83b4b801bed07647a:0">When a user approves the <code>offline_access</code> scope, your app can receive refresh tokens from the v2.0 token endpoint. Refresh tokens are long-lived. Your app can get new access tokens as older ones expire.</p>
<p class="lf-text-block lf-block" style="padding-left: 60px;" data-lf-anchor-id="8dd46d8ddd9b62bb39c9985b65034473:0">If your app does not request the <code>offline_access</code> scope, it won't receive refresh tokens.</p>
</blockquote>

<p><strong>So how do we do it?</strong></p>

<p>Unfortunately flask_oauthlib does not directly support refresh tokens, but it does support <a href="http://flask-oauthlib.readthedocs.io/en/latest/client.html?highlight=post#invoking-remote-methods">remote methods</a>, so we should be able to simply make a POST request for a new access token! Here is the surprisingly simple code you need:</p>

```python
    data = {}
    data['grant_type'] = 'refresh_token'
    data['refresh_token'] = session['refresh_token']
    data['client_id'] = microsoft.consumer_key
    data['client_secret'] = microsoft.consumer_secret
    
    response = (microsoft.post(microsoft.access_token_url, data=data)).data
```

<p>That's it! What you are not seeing here is the original code used to get an access token, but I am just doing the normal flask_oauthlib stuff (which you can find in <a href="https://github.com/Azure-Samples/active-directory-python-flask-graphapi-web-v2">this sample</a>), and storing the results of the token response in the user's session (Access Token, Expires In, and Refresh Token).</p>

<p>Now, in order to invoke this code at the right time, I need to create a <a href="http://flask.pocoo.org/docs/0.12/patterns/viewdecorators/">view decorator</a>, and Flask has a sample for almost exactly what we want to do here: a login required decorator.</p>

<p>Basically, we add this decorator to any view where we expect the user to be signed in. If the user has no token, we will redirect them to the login page. If they have an expired token and a refresh token, we will use the refresh token to get a new access token. Otherwise, if the token is present and valid, we simply let the view load.</p>

<p>Check it out in full action here:</p>

```python
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'microsoft_token' in session:
            if session['expires_at'] > datetime.now():
                return f(*args, **kwargs)
            elif 'refresh_token' in session:
                # Try to get a Refresh Token
                data = {}
                data['grant_type'] = 'refresh_token'
                data['refresh_token'] = session['refresh_token']
                data['client_id'] = microsoft.consumer_key
                data['client_secret'] = microsoft.consumer_secret

                response = (microsoft.post(microsoft.access_token_url, data=data)).data
                
                if response is None:
                    session.clear()
                    print("Access Denied: Reason=%s\nError=%s" % (response.get('error'),request.get('error_description')))
                    return redirect(url_for('index'))
                else:
                    session['microsoft_token'] = (response['access_token'], '')
                    session['expires_at'] = datetime.now() + timedelta(seconds=int(response['expires_in']))
                    session['refresh_token'] = response['refresh_token']
                    return f(*args, **kwargs)
        else:
            return redirect(url_for('login'))
    return wrap
```

<p>So now when we want to make a page require login we simply set up our view function like so:</p>

```python
@app.route('/home')
@login_required
def home():
    #view code goes here
```

<p>Adding this kind of code to your Azure AD Flask application can really be the difference between a good and bad user experience. Let me know if this ends up helping you out!</p>