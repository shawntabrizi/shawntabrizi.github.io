"use strict";(self.webpackChunkshawntabrizi=self.webpackChunkshawntabrizi||[]).push([[3337],{83812:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>h,contentTitle:()=>r,default:()=>l,frontMatter:()=>s,metadata:()=>i,toc:()=>c});var o=n(85893),a=n(11151);const s={title:"Decoding JWT Tokens",date:new Date("2017-07-05T15:38:50.000Z"),authors:"shawntabrizi",slug:"/aad/decoding-jwt-tokens/",categories:["AAD"],tags:["azure active directory","javascript","json web token","programming"],github:"JWT-Decoder-Javascript"},r=void 0,i={permalink:"/blog/aad/decoding-jwt-tokens/",source:"@site/blog/2017-07-05-decoding-jwt-tokens.md",title:"Decoding JWT Tokens",description:'Forewarning: I know that "JWT Tokens" is case of RAS syndrome... but I can\'t help it!',date:"2017-07-05T15:38:50.000Z",formattedDate:"July 5, 2017",tags:[{label:"azure active directory",permalink:"/blog/tags/azure-active-directory"},{label:"javascript",permalink:"/blog/tags/javascript"},{label:"json web token",permalink:"/blog/tags/json-web-token"},{label:"programming",permalink:"/blog/tags/programming"}],readingTime:3.24,hasTruncateMarker:!1,authors:[{name:"Shawn Tabrizi",title:"Software Engineer",url:"https://github.com/shawntabrizi",imageURL:"https://github.com/shawntabrizi.png",key:"shawntabrizi"}],frontMatter:{title:"Decoding JWT Tokens",date:"2017-07-05T15:38:50.000Z",authors:"shawntabrizi",slug:"/aad/decoding-jwt-tokens/",categories:["AAD"],tags:["azure active directory","javascript","json web token","programming"],github:"JWT-Decoder-Javascript"},unlisted:!1,prevItem:{title:"Azure AD Authentication with PowerShell and ADAL",permalink:"/blog/aad/azure-ad-authentication-with-powershell-and-adal/"},nextItem:{title:"Discovery through Experience",permalink:"/blog/personal/discovery-through-experience/"}},h={authorsImageUrls:[void 0]},c=[{value:"Are your tokens safe when using online decoders?",id:"are-your-tokens-safe-when-using-online-decoders",level:2},{value:"JSON Web Token Structure",id:"json-web-token-structure",level:2}];function d(e){const t={a:"a",blockquote:"blockquote",code:"code",h2:"h2",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(t.blockquote,{children:["\n",(0,o.jsxs)(t.p,{children:['Forewarning: I know that "JWT Tokens" is case of ',(0,o.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/RAS_syndrome",children:"RAS syndrome"}),"... but I can't help it!"]}),"\n"]}),"\n",(0,o.jsx)(t.h2,{id:"are-your-tokens-safe-when-using-online-decoders",children:"Are your tokens safe when using online decoders?"}),"\n",(0,o.jsx)(t.p,{children:"In the identity space, decoding JSON Web Tokens (JWT tokens) is a regular event. One of the first things we do in order to try and debug issues that customers or partners are having is taking a quick peek into the access tokens they are using, and seeing if anything is wrong."}),"\n",(0,o.jsx)(t.p,{children:'In Azure Active Directory, we are commonly looking at the "audience" claim or the "scopes" in the token to make sure that they have the token to the right resource, and they have the right level of permissions for the task. But sometimes problems can be even more subtle than that. For example, the "tenant" information can be wrong, and people may never notice the subtle difference in GUID.'}),"\n",(0,o.jsxs)(t.p,{children:["Either way, being able to read the contents of a token is crucial, and so I have always relied on small web apps created by others to do this. However, at work recently, there was discussion about how the most popular site for this (",(0,o.jsx)(t.a,{href:"https://jwt.io/",children:"https://jwt.io/"}),") may be storing the tokens that are submitted into the app. If someone submits a token that is still active, there is a possibility that the site could use that token and impersonate you! Furthermore, the website was created by a Microsoft competitor, Auth0... so just bad news in general."]}),"\n",(0,o.jsx)(t.p,{children:"I wanted to create my own JWT decoder so that I know for certain that my tokens are not being used maliciously, and so I could learn a little more about JWT tokens in general."}),"\n",(0,o.jsxs)(t.p,{children:["I created this very basic page: ",(0,o.jsx)(t.a,{href:"https://shawntabrizi.com/JWT-Decoder/",children:"https://shawntabrizi.com/JWT-Decoder/"})]}),"\n",(0,o.jsxs)(t.p,{children:["You can find the GitHub source ",(0,o.jsx)(t.a,{href:"https://github.com/shawntabrizi/JWT-Decoder",children:"here"}),". Let's talk about what I did."]}),"\n",(0,o.jsx)(t.h2,{id:"json-web-token-structure",children:"JSON Web Token Structure"}),"\n",(0,o.jsxs)(t.p,{children:["A JWT token is broken up into 3 sections, all separated by periods. The first section is the Header, which contains information about the token type and the algorithm used to sign or encrypt that token. The second section is the Payload, where all the main claims are stored for the token. Finally, the third section is the token signature, where a token issuer can prove that they were the ones that actually minted the token. Tokens do not need to be signed, and if they are not, the third section will be empty. However, they will still contain a period to separate it from the second section as ",(0,o.jsx)(t.a,{href:"https://tools.ietf.org/html/rfc7519#section-6.1",children:"shown here"}),"."]}),"\n",(0,o.jsx)(t.p,{children:"The problem I needed to solve was pretty simple: Take the encoded JWT token, and get the claims out of it. I think the easiest way to explain the steps is simply to look at my commented code:"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-javascript",children:'//This function takes a base 64 url encoded string, and converts it to a JSON object... using a few steps.\nfunction decoder(base64url) {\n  try {\n    //Convert base 64 url to base 64\n    var base64 = base64url.replace("-", "+").replace("_", "/");\n    //atob() is a built in JS function that decodes a base-64 encoded string\n    var utf8 = atob(base64);\n    //Then parse that into JSON\n    var json = JSON.parse(utf8);\n    //Then make that JSON look pretty\n    var json_string = JSON.stringify(json, null, 4);\n  } catch (err) {\n    json_string = "Bad Section.\\nError: " + err.message;\n  }\n  return json_string;\n}\n'})}),"\n",(0,o.jsxs)(t.p,{children:['JWT tokens are Base 64 URL encoded. While they are nearly the same, characters like "+" and "/" turn into "-" and "_" respectively. Learn more ',(0,o.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Base64#URL_applications",children:"here"}),". From there, converting a Base 64 encoded string to a pretty JSON string is really self explanatory."]}),"\n",(0,o.jsx)(t.p,{children:"The rest of the work beyond this is just handling random user inputs. We have checks to verify the individual parts of the token are good, and whether or not the token contains a signature. As I suspected, creating a site to decode JWT tokens is really quite simple, and now I have my own site to do it on!"})]})}function l(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},11151:(e,t,n)=>{n.d(t,{Z:()=>i,a:()=>r});var o=n(67294);const a={},s=o.createContext(a);function r(e){const t=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),o.createElement(s.Provider,{value:t},e.children)}}}]);