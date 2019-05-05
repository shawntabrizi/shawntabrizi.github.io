---
title: Set up Azure Service Health Alerts programmatically using PowerShell
date: 2018-01-10T23:03:59-08:00
author: Shawn Tabrizi
layout: post
permalink: /azure-service-health/set-azure-service-health-alerts-programmatically-using-powershell/
categories:
  - Azure Service Health
tags:
  - arm
  - azure resource manager
  - azure service health
  - health alert
  - powershell
---

The Azure Service Health team has been working hard to make it [easy for you to set up custom service health alerts](https://azure.microsoft.com/en-us/blog/get-notified-when-azure-service-incidents-impact-your-resources/) for your Azure resources. While we primarily focus on user experiences in the portal, we also know that there are many power users who are interested in doing these same actions in a programmatic way.

This post will walk you through the steps required to programmatically create a service health alert using [Azure Resource Manager templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authoring-templates) and [Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/overview).

As described [here](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-create-activity-log-alerts-with-resource-manager-template), you can create any kind of activity log alert using this method ([Administrative, Autoscale, Recommendation, etc...](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs#categories-in-the-activity-log)), however for the purposes of clarity, we will specifically focus on service health alerts.

## Getting Started

Before you can follow this tutorial, you must have Azure PowerShell installed on your system. This will give you access to the `AzureRM` module, which is needed to interact with your Azure subscription.

You can follow the instructions [here to install Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps).

## Creating an ARM Template for Service Health Alerts

A service health alert is represented by JSON which is stored in your Azure subscription, and follows rules defined by Azure's internal system. This JSON is also referred to as the Azure Resource Manager template. You can find an example of a general Activity Log Alert template [here](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-create-activity-log-alerts-with-resource-manager-template).

For service health alerts, we should use a template like this:

```javascript
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "activityLogAlertName": {
      "type": "string",
      "metadata": {
        "description": "Unique name (within the Resource Group) for the Activity log alert."
      }
    },
    "activityLogAlertEnabled": {
      "type": "bool",
      "defaultValue": true,
      "metadata": {
        "description": "Indicates whether or not the alert is enabled."
      }
    },
    "actionGroupResourceId": {
      "type": "string",
      "metadata": {
        "description": "Resource Id for the Action group."
      }
    }
  },
  "resources": [   
    {
      "type": "Microsoft.Insights/activityLogAlerts",
      "apiVersion": "2017-04-01",
      "name": "[parameters('activityLogAlertName')]",      
      "location": "Global",
      "kind": null,
      "tags": {},
      "properties": {
        "enabled": "[parameters('activityLogAlertEnabled')]",
        "description": "",
        "scopes": [
            "[subscription().id]"
        ],        
        "condition": {
          "allOf": [
            {
              "field": "category",
              "equals": "ServiceHealth",
              "containsAny" : null
            }
          ] 
        },
        "actions": {
          "actionGroups": 
          [
            {
              "actionGroupId": "[parameters('actionGroupResourceId')]",
              "webhookProperties": {}
            }
          ]
        }
      }
    }
  ]
}
```

You should save this file as `servicehealthalert.json`.

#### A quick note on generating custom ARM templates

I would assume that most of you reading this post do not want or need to start from scratch. Instead, you know what you want to achieve using the Azure portal UX, and you simply want to automate that process. In that case, there is an easy way for you to generate a custom ARM template for your needs:

1.  Go to the [Health Alerts](https://portal.azure.com/#blade/Microsoft_Azure_Health/AzureHealthBrowseBlade/healthalerts) section in Azure Service Health
2.  Create a [new service health alert](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-activity-log-alerts-on-service-notifications?toc=%2fazure%2fservice-health%2ftoc.json)
3.  Take note of the resource group you save the alert in
4.  Then go to the [Azure Resource Explorer](https://resources.azure.com/)
5.  Navigate to: subscriptions > (subscription) > resourceGroups > (resourceGroup) > providers > microsoft.insights > activityLogAlerts > (alertName)
6.  You will find a JSON representation of your alert with all your custom conditions
7.  Copy those extra conditions into the template above

## Examples of Custom Conditions

The template provided above is a very broad service health alert that will be triggered whenever any activity log with the category `ServiceHealth` is created. However, using this same JSON template, you can further specify what kinds of events you want to be alerted for:

* Only be notified for certain Azure services
* Only be notified for certain regions
* Only be notified for certain health alert types

Note that there are over 122 Azure services, across more than 28 regions, so your JSON can start to get a little messy if you try to hand type it all out. I recommend you follow the instructions above on generating custom ARM templates.

Here is an example of an ARM template that takes advantage of all 3 of these conditions:

```javascript
{
   "$schema":"https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion":"1.0.0.0",
   "parameters":{
      "activityLogAlertName":{
         "type":"string",
         "metadata":{
            "description":"Unique name (within the Resource Group) for the Activity log alert."
         }
      },
      "activityLogAlertEnabled":{
         "type":"bool",
         "defaultValue":true,
         "metadata":{
            "description":"Indicates whether or not the alert is enabled."
         }
      },
      "actionGroupResourceId":{
         "type":"string",
         "metadata":{
            "description":"Resource Id for the Action group."
         }
      }
   },
   "resources":[
      {
         "type":"Microsoft.Insights/activityLogAlerts",
         "apiVersion":"2017-04-01",
         "name":"[parameters('activityLogAlertName')]",
         "location":"Global",
         "kind":null,
         "tags":{

         },
         "properties":{
            "enabled":"[parameters('activityLogAlertEnabled')]",
            "description":"",
            "scopes":[
               "[subscription().id]"
            ],
            "condition":{
               "allOf":[
                  {
                     "field":"category",
                     "equals":"ServiceHealth",
                     "containsAny":null
                  },
                  {
                     "field":"properties.incidentType",
                     "equals":"Informational",
                     "containsAny":null
                  },
                  {
                     "field":"properties.incidentType",
                     "equals":"ActionRequired",
                     "containsAny":null
                  },
                  {
                     "field":"properties.impactedServices[?(@.ServiceName == 'Advisor' || @.ServiceName == 'Alerts & Metrics' || @.ServiceName == 'App Service')].ImpactedRegions[*].RegionName",
                     "equals":null,
                     "containsAny":[
                        "Australia East",
                        "Brazil South",
                        "Canada East",
                        "Central US"
                     ]
                  }
               ]
            },
            "actions":{
               "actionGroups":[
                  {
                     "actionGroupId":"[parameters('actionGroupResourceId')]",
                     "webhookProperties":{

                     }
                  }
               ]
            }
         }
      }
   ]
}
```

The ARM template is actually pretty powerful in terms of the logic that it can resolve. You are not limited to only these 3 options when customizing the alert. You can pretty much add logic to any attribute which exists in the activity log. However, if you customize the JSON template too much, you might break the UX in the Azure portal. This is not a big deal, but can cause problems loading the alert in the portal, and if you do ever update the alert in the portal, you will likely lose all of your custom logic.

## Creating a new alert using PowerShell

Now that you have your ARM template created, creating a new activity log alert in your subscription is relatively easy. Using the `AzureRM` module, run the following:

```powershell
Login-AzureRmAccount

Select-AzureRmSubscription -SubscriptionName <subscription_name>

New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName <resource_group> -TemplateFile <path:\to\servicehealthalert.json>
```

You should then be prompted to type in the Alert Name and the Action Group Resource ID:

```powershell
Supply values for the following parameters:
(Type !? for Help.)
activityLogAlertName: <Alert Name>
actionGroupResourceId: /subscriptions/<subscriptionId>/resourceGroups/<resouceGroup>/providers/microsoft.insights/actionGroups/<actionGroup>
```

If there are no errors, you should get the following confirmation in PowerShell:

```powershell
DeploymentName          : ExampleDeployment
ResourceGroupName       : <resourceGroup>
ProvisioningState       : Succeeded
Timestamp               : 11/8/2017 2:32:00 AM
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name                     Type       Value
                          ===============          =========  ==========
                          activityLogAlertName     String     <Alert Name>
                          activityLogAlertEnabled  Bool       True
                          actionGroupResourceId    String     /subscriptions/<subscriptionId>/resourceGroups/<resouceGroup>/providers/microsoft.insights/actionGroups/<actionGroup>

Outputs                 :
DeploymentDebugLogLevel :
```

And that is it! You can now stay fully informed when Azure service issues affect you.
