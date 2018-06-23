# Exercise 06: Check Resource Consumption

## Estimated time

:clock4: 5 minutes

## Exercise description
In this exercise, you will try out options to check resources consumed by the application.

### Let's use the cockpit option for checking resource consumption.__
1. Navigate to Applications.

![App List](/img/App_list.png?raw=true)

2. Choose the name of application. The application overview page appears.

3. In the **Application Overview** page, view the **Instances** section to view the resources consumed by instances of the application.

![Instances](/img/resource_instance.png?raw=true)

### Let's use the Cloud Foundry command line interface to check resource consumption.__

1. Enter the command `cf app {app_name}`.

![Resource Consumption](/img/console_hr_scale_.png?raw=true)
