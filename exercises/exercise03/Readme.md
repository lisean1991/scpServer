# Exercise 03: Deploy and Launch Node.js Application

## Estimated time

:clock4: 10 minutes

## Exercise description

In this exercise, you will get familiar with the application manifest file and its content. You will modify the content of this file and deploy the application from the cockpit. You also have the option to deploy the application from the command line interface.

### Let's use the SAP Cloud Platform cockpit

1. Clone the content of the git repository available at the [GitHub link](https://github.com/SAP/cf-sample-app-nodejs) using the command `git clone https://github.com/SAP/cf-sample-app-nodejs`. If the `git clone` command fails, then you will have to:
  - manually download the zip file from repository home page (see photo below)
  - decompress the zip File
  - rename the folder to `hello-nodejs`

![Download Zip](/img/zip_dl.png?raw=true)

2. Compress the contents of the folder **hello-nodejs** to zip file format.

![Zip File](/img/zip_file.png?raw=true)

3. Navigate to the project folder on your local system.

4. Open the `manifest.yml` file in an editor.

5. Provide a **unique** host value. You should use your birth date or a random number or string. Routes are shared across the whole platform, so if someone else is already using it, then you won't be able to push your application. On the other hand, if you are the "owner" of that route, then you can bind multiple apps to the same route.

![Manifest](/img/manifest_host.png?raw=true)

6. Save the changes.

7. Choose the default "dev" space.

![Space](/img/space.png?raw=true)

8. Choose **Deploy Application**.

![DeployApp](/img/deploy_app.png?raw=true)

9. In the **Deploy Application** dialog, provide the following:

 + Choose **Browse** to navigate and select the compressed file (ZIP) for the application.
 + Select **Use Manifest**.
 + Choose **Browse** to navigate and select the manifest file.
 + Choose **Deploy**.

 ![DeployApp](/img/dep_app.png?raw=true)

**Result:**<br>
The application is uploaded to the SAP Cloud Platform. The application is automatically started and the resources consumed by the application are displayed.

10. Choose the name of the application. The application overview page appears.

11. From the **Application Routes** section, choose the link to start the application.

![App Routes](/img/app_routes_section.png?raw=true)

 **Result:**

The application appears in a new tab.

![App](/img/app.png?raw=true)

### Let's use the Cloud Foundry command line interface to deploy and launch the application

1. Navigate to the project folder on your local system.

2. Open the `manifest.yml` file in an editor.

3. Change the name of the application. This is to ensure that applications to be deployed on the SAP Cloud Platform has a unique name.

![Change Name](/img/change_app_name_mani.png?raw=true)

4. Save the changes.

5. Update the new application name in the `package.json` file.

![Package JSON](/img/pack_json_name_chg.png?raw=true)

6. Save the changes.

7. Navigate to the project folder using the command `cd {path of the project folder}`

8. Enter the command `cf push`. The application is uploaded and the resources consumed by the application are displayed.

![Push Command](/img/app_started.png?raw=true)
