# Exercise 09: Blue-Green Deployment

## Estimated time

:clock4: 10 minutes

## Exercise description

1. Open the manifest file and change the application name to **cf-nodejs-green**.

![Manifest](/img/green_app.png?raw=true)

2. Open the command line interface console in the node.js sample application and push the new version using the command **cf push**.<br>
**Result:**
Now you have two instances of the node.js application running. The "productive" where all the traffic is directed and the new one that you can test by accessing different URL. Check that the changed version works as expected accessing it under the different URL.

![Application](/img/dual_apps.png?raw=true)

3. Switch the router so that all incoming requests go to the new application version (Green). Enter the original URL route to the green application using the command
    ```
    cf map-route GREEN_APP_NAME DOMAIN -n BLUE_APP_HOSTNAME
    ```
    **Result:**
    After the `cf map-route` command, the Cloud Foundry router continues sending traffic for temporary URL to the Green application. Within a few seconds, the Cloud Foundry router begins load balancing traffic for the original productive URL between Blue and Green version of the application.

4. Unmap the route to Blue version after you verify that the Green version is running as expected, stop routing requests to Blue version using the **cf unmap-route** command.
    ```
    cf unmap-route BLUE_APP_NAME DOMAIN -n HOSTNAME
    ```
    **Result:**
    The Cloud Foundry router stops sending traffic to Blue version. Now all traffic for the productive domain is sent to Green version.
