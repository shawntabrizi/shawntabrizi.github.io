"use strict";(self.webpackChunkshawntabrizi=self.webpackChunkshawntabrizi||[]).push([[74551],{13230:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>c,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var n=o(85893),a=o(11151);const r={title:"Revoking Consent for Azure Active Directory Applications",date:new Date("2017-08-11T15:17:38.000Z"),authors:"shawntabrizi",slug:"/aad/revoking-consent-azure-active-directory-applications/",categories:["AAD"],tags:["azure active directory","azure portal","consent","my apps portal","tenant administrator"]},i=void 0,s={permalink:"/blog/aad/revoking-consent-azure-active-directory-applications/",source:"@site/blog/2017-08-11-revoking-consent-azure-active-directory-applications.md",title:"Revoking Consent for Azure Active Directory Applications",description:"Today I was presenting one of my hackathon projects which I worked on this year to the Identity team at Microsoft. In order for my project to work, I needed to get consent to read the mail of the signed-in user. Depending on who you talk to, a permission like this could be easy as pie to consent to or something that they would never accept. Some people fall in the middle where they are happy to consent as long as they can choose to revoke that consent after they are done playing with the app.",date:"2017-08-11T15:17:38.000Z",formattedDate:"August 11, 2017",tags:[{label:"azure active directory",permalink:"/blog/tags/azure-active-directory"},{label:"azure portal",permalink:"/blog/tags/azure-portal"},{label:"consent",permalink:"/blog/tags/consent"},{label:"my apps portal",permalink:"/blog/tags/my-apps-portal"},{label:"tenant administrator",permalink:"/blog/tags/tenant-administrator"}],readingTime:2.37,hasTruncateMarker:!1,authors:[{name:"Shawn Tabrizi",title:"Software Engineer",url:"https://github.com/shawntabrizi",imageURL:"https://github.com/shawntabrizi.png",key:"shawntabrizi"}],frontMatter:{title:"Revoking Consent for Azure Active Directory Applications",date:"2017-08-11T15:17:38.000Z",authors:"shawntabrizi",slug:"/aad/revoking-consent-azure-active-directory-applications/",categories:["AAD"],tags:["azure active directory","azure portal","consent","my apps portal","tenant administrator"]},unlisted:!1,prevItem:{title:"Refresh Tokens for Azure AD V2 Applications in Flask",permalink:"/blog/aad/refresh-tokens-azure-ad-v2-applications-flask/"},nextItem:{title:"Scraping LinkedIn Topics and Skills Data",permalink:"/blog/code/scraping-linkedin-topics-skills-data/"}},l={authorsImageUrls:[void 0]},p=[{value:"Using the My Apps Portal for Individual User Consent",id:"using-the-my-apps-portal-for-individual-user-consent",level:2},{value:"Using the Azure Portal to Remove Tenant Wide Consent",id:"using-the-azure-portal-to-remove-tenant-wide-consent",level:2}];function A(e){const t={a:"a",h2:"h2",img:"img",p:"p",...(0,a.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"Today I was presenting one of my hackathon projects which I worked on this year to the Identity team at Microsoft. In order for my project to work, I needed to get consent to read the mail of the signed-in user. Depending on who you talk to, a permission like this could be easy as pie to consent to or something that they would never accept. Some people fall in the middle where they are happy to consent as long as they can choose to revoke that consent after they are done playing with the app."}),"\n",(0,n.jsx)(t.p,{children:"That is why I am writing this. How easy it is to forget that it is NOT very obvious what you need to do to revoke consent for an Azure Active Directory Application. Even people on the Identity team don't always know! So let's talk about how you can do it :)"}),"\n",(0,n.jsx)(t.h2,{id:"using-the-my-apps-portal-for-individual-user-consent",children:"Using the My Apps Portal for Individual User Consent"}),"\n",(0,n.jsxs)(t.p,{children:["You can revoke individual user consent through the ",(0,n.jsx)(t.a,{href:"https://myapps.microsoft.com/",children:"My Apps Portal"}),". Here you should see a view of all applications that you or even your administrator (on your behalf) has consented to:"]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:o(66297).Z+"",width:"975",height:"574"})}),"\n",(0,n.jsx)(t.p,{children:'With applications your admin has consented to, all you can do is open the app, however for apps where you individually consented as a user, you can click "Remove" which will revoke consent for the application.'}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:o(45240).Z+"",width:"720",height:"347"})}),"\n",(0,n.jsx)(t.h2,{id:"using-the-azure-portal-to-remove-tenant-wide-consent",children:"Using the Azure Portal to Remove Tenant Wide Consent"}),"\n",(0,n.jsxs)(t.p,{children:["If you are a tenant administrator, and you want to revoke consent for an application across your entire tenant, you can go to the ",(0,n.jsx)(t.a,{href:"https://portal.azure.com/",children:"Azure Portal"}),". Whether it be for a bunch of users who individually consented or for an admin who consented on behalf of all the users, by simply deleting the application's service principal, you will remove all ",(0,n.jsx)(t.a,{href:"https://msdn.microsoft.com/en-us/library/azure/ad/graph/api/entity-and-complex-type-reference#oauth2permissiongrant-entity",children:"OAuth 2 Permission Grants"})," (the object used to store consent) linked to that application. Think about removing the service principal like uninstalling the application from your tenant."]}),"\n",(0,n.jsxs)(t.p,{children:["You could delete the service principal a bunch of different ways like through ",(0,n.jsx)(t.a,{href:"https://docs.microsoft.com/en-us/powershell/module/azuread/remove-azureadserviceprincipal",children:"Azure Active Directory PowerShell"})," or through the ",(0,n.jsx)(t.a,{href:"https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/api/serviceprincipal_delete",children:"Microsoft Graph API"}),", but the easiest way for the average administrator is right through the Azure Portal."]}),"\n",(0,n.jsx)(t.p,{children:"Navigate to the Enterprise Applications blade in the Azure portal:"}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:o(51552).Z+"",width:"454",height:"275"})}),"\n",(0,n.jsx)(t.p,{children:'Then click "All Applications" and search for the application you want to revoke consent for:'}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:o(1839).Z+"",width:"988",height:"303"})}),"\n",(0,n.jsx)(t.p,{children:'When you click the application, you will be brought to an "Overview" section, where a tempting button called "Delete" will be at the top. Before you click this button, you might want to take a peak at the "Permissions" section to see the types of consent that was granted to this application:'}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:o(90442).Z+"",width:"638",height:"286"})}),"\n",(0,n.jsx)(t.p,{children:'Once you feel confident that you want to delete this application, go back to "Overview" and click "Delete"!'}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:o(58691).Z+"",width:"844",height:"451"})}),"\n",(0,n.jsx)(t.p,{children:"Viola! The app and all consent associated with that app is now gone."})]})}function c(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(A,{...e})}):A(e)}},66297:(e,t,o)=>{o.d(t,{Z:()=>n});const n=o.p+"assets/images/img_598d51215d1c7-1b2d24feec123f5c5fc0e9006c8d5e7d.png"},45240:(e,t,o)=>{o.d(t,{Z:()=>n});const n=o.p+"assets/images/img_598d517f175d3-70ec37737b63fc1f28bbdb0983dbb07a.png"},51552:(e,t,o)=>{o.d(t,{Z:()=>n});const n="data:image/png;base64,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"},1839:(e,t,o)=>{o.d(t,{Z:()=>n});const n=o.p+"assets/images/img_598d594ddf163-abaeec6b15e5f40cc4dffe407e034f02.png"},90442:(e,t,o)=>{o.d(t,{Z:()=>n});const n=o.p+"assets/images/img_598d59b5e2851-190c52599472d113d8df8df423a71ac7.png"},58691:(e,t,o)=>{o.d(t,{Z:()=>n});const n=o.p+"assets/images/img_598d5ae51090c-bc427c5a04213e33958efb38d0be491c.png"},11151:(e,t,o)=>{o.d(t,{Z:()=>s,a:()=>i});var n=o(67294);const a={},r=n.createContext(a);function i(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);