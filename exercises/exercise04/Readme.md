# Exercise 04: Start and Stop an Application

## Estimated time

:clock4: 5 minutes

## Exercise description

In this exercise, you will get familiar with the various operations performed on an application. You have options to perform this operation using cockpit or command line interface.

### Let's use the SAP Cloud Platform cockpit

1. Navigate to **Applications**.

![App List](/img/App_list.png?raw=true)

2. In the **Actions** column, choose (stop).
The application stops and displays the status.

![App Stop](/img/App_list_stop.png?raw=true)

3. To restart the application, in the **Actions** column, choose (start).

### Let's use the Cloud Foundry command line interface to start and stop the application

1. List applications in your account using the command `cf apps`.

![List App](/img/status_app.png?raw=true)


2. To stop the running application, enter the command `cf stop {app_name}`.

![Stop App](/img/stop_cm.png?raw=true)


3. To check the status of the application, enter the command `cf app {app_name}`.

![Status of App](/img/status_specifi_app.png?raw=true)

4. To restart the application that is currently stopped, enter the command `cf start {app_name}`.

![Restart App](/img/app_restart.png?raw=true)
