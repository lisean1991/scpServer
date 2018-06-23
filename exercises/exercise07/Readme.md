# Exercise 07: Check Logs

## Estimated time

:clock4: 10 minutes

## Exercise description

Before being able to see logs in Kibana, the service `application-logs` must be bound to the app.

Let's use the CLI to create and bind a service instance to our application.

```
cf marketplace
cf create-service application-logs lite myapplogs
cf services
cf bind-service cf-nodejs myapplogs
cf restage cf-nodejs
```

Let's then use the cockpit for checking logs.
1. In the **Application Overview** page, choose **Logs**.

![Logs](/img/logs_nav.png?raw=true)

:dart: Result:
The logs for the application appears. For analysis of logs, you can choose **Open Log Analysis**. You can also download the logs to your local system.

![Cockpit_Logs](/img/logs.png?raw=true)

### Let's use the Cloud Foundry command line interface to check resource consumption.

1. Enter the command `cf logs {app_name}`. This command generates real-time log streams. Initiate an activity to view logs. To exit real-time stream, use **Ctrl+C**.

![CF Logs](/img/console_logs.png?raw=true)

2. To view the most recent logs, enter the command, `cf logs {app_name} --recent`.
