# Exercise 02: Create And Access Trial Account

## Estimated time

:clock4: 10 minutes

## Exercise description

In this exercise you'll learn how you can create free trial account on the SAP Cloud Platform, start your Cloud Foundry Environment trial, setup local development environment and explore a bit the SAP Cloud Platform cockpit which is the web based administration tool for SAP Cloud Platform.

## Start your Cloud Foundry Trial

1. Go to the [SAP Cloud Platform cockpit](https://account.hana.ondemand.com/#/home/welcome) and navigate to your user home. You should see a button *Start Cloud Foundry Trial*.  
<br><br>
![Start Cloud Foundry Trial](/img/start_cf_trial.png?raw=true)
<br><br>
2. Click on the *Start Cloud Foundry Trial* button – a pop-up will appear. Select a region from the dropdown for your trial and click OK
- If you attend TechEd Las Vegas or TechEd Bangalore select US East (VA) region.
- If you attend TechEd Barcelona, select Europe (Frankfurt) region.
<br><br>
![Select Trial Region](/img/select_trial_region.png?raw=true)
<br><br>

3. Wait for the procedure to finish. You will get a Global Account, Subaccount, Organization and Space in the region you selected. Once these are created you can navigate to your new Space (click on Go to Space button)
<br><br>
![Select Trial Region](/img/go_to_space.png?raw=true)
<br><br>


:bulb: **Note:** If you already started your Cloud Foundry environment trial you won't see *Start Cloud Foundry Trial* button. In this case, simply click on the *Go to Cloud Foundry Trial* button.
<br><br>
![GO to trial](/img/go_to_trial_button.png?raw=true)
<br><br>
You are now in your Cloud Foundry trial space.

## Cockpit
This is a simplified picture of the domain model you have in the Cloud Foundry Environment. If you want to learn more about the different entities, check the [documentation.](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/8ed4a705efa0431b910056c0acdbf377.html)

<br><br>
![Domain Model Overview](/img/domain_model.png?raw=true)
<br><br>

This is what you see now in Cockpit:
<br><br>
![Cockpit Domain Model Overview](/img/cockpit_domain_model.png?raw=true)
<br><br>

## Login Using the CLI
Set the api target with:
```
cf api https://api.cf.eu10.hana.ondemand.com
```
then login using `cf login`. Enter the details as provided during registration.

Enter then the command `cf target`. This command displays the default organization and space for your account. In case of multiple organizations, it allows you to set a default organization (`-o`) and space (`-s`) within the organization.
