# Exercise 05: Scaling an Application

## Estimated time

:clock4: 5 minutes

## Exercise description

In this exercise, you will understand how to scale an application horizontally and vertically. Horizontal scaling implies increasing or decreasing the number of application instances. Vertical scaling implies changing the disk space limit or memory limit applied to all instances of the application.

### Let's use the cockpit option for horizontal scaling (increasing or decreasing the number of application instances)

1. Navigate to Applications.

![App List](/img/App_list.png?raw=true)

2. Choose the name of application. The application overview page appears.

3. In the Application Overview page, choose the + instance button to increase the number of application instance by 1. For more instances, choose the button as per the required number of instances.

![Scale Up](/img/scale_up_cockpit.png?raw=true)

4. To decrease the number of application instances, choose the - instance button.

![Scale Down](/img/scale_down.png?raw=true)

### Let's use the cockpit option for vertical scaling (changing the disk space limit or memory limit applied to all instances of the application)

1. In the **Application Overview** page, choose the **Change Quota** button to change the memory or disk quota.

![Vertical Scale](/img/vertical_scale_cockpit.png?raw=true)

2. To restart the application, choose **Restart**.

![Restart](/img/restart_app.png?raw=true)

### Let's use the Cloud Foundry command line interface to horizontally scale the application

1. Enter the command `cf scale {app_name} -i {no_of_instance}`. The application instances appear as per the specified number.

2. To view the number of instances, enter the command `cf app {app_name}`.

![Console Client Scale Up](/img/scale_up.png?raw=true)

### Let's use the Cloud Foundry command line interface to vertically scale the application

1. Enter the command `cf scale {app_name} -m {memory} -k {disk}`. Example values for `memory` and `disk` are: `256M, 1024M, 1G`.

![Console Client Vertical Scale](/img/console_vert_scale.png?raw=true)
