# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


## Setup WSL and Git

For WSL Setup,

- Enable Virtualization and Windows Subsystem for Linx from `Turn features on and off` in windows 
- Also, enable virtualizaiton from BIOS if not enabled
- Open powerShell as Admin, run `wsl --install`

```bash
git config --global user.name "<username>"
git config --global user.email "<email>"
git config --list

ssh-keygen -t ed25519 -f ~/.ssh/<ssh-desired-key-name>
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/<ssh-desired-key-name>

cat ~/.ssh/id_ed25519.pub -> copy this key and add it github `SSH and GPG Keys` section. If you are adding 
this ssh key for organization access, then `Configure SSO` and `Authorize` your organization.

ssh -T git@github.com -> to test the github connection after adding SSH key.
```

- create a config file in `.ssh` dir and put the following in that config file to setup multiple organizaitons,

```bash
# Personal GitHub account
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/<personal-ssh-key>

# Organization GitHub account
Host github.com-organization
    HostName github.com
    User git
    IdentityFile ~/.ssh/<organization-sso-authorized-ssh-key>
```

- Now to clone a repo using your personal and organization sso authorized ssh key,

```bash
git clone git@github.com-personal:<username>/<repository>.git

git clone git@github.com-organization:<username>/<repository>.git
```

## Setup Node and Yarn Locally (for Linux/Ubuntu)

- Goto node website: https://nodejs.org/en/download and download for Linux as per your architecture,

- Run the following commands to setup node,

```bash
wget https://nodejs.org/dist/v20.15.0/node-v20.15.0-linux-x64.tar.xz (https://nodejs.org/en/download/prebuilt-binaries), Choose Linux and x64
tar -xvf node-v20.11.1-linux-x64.tar.xz
sudo mv node-v20.11.1-linux-x64 /usr/local/
sudo ln -sf /usr/local/node-v20.11.1-linux-x64/bin/node /usr/bin/node
sudo ln -sf /usr/local/node-v20.11.1-linux-x64/bin/npm /usr/bin/npm
sudo ln -sf /usr/local/node-v20.11.1-linux-x64/bin/npx /usr/bin/npx
```

- Verify the installation by running the following commands,

```bash
node -v
npm -v
npx -v
```

- If the installation is successful, you must get versions of these packages without any errors.

```bash
sudo apt update
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install --no-install-recommends yarn
yarn --version
```

## Setup CDK with node

- After node setup, follow the AWS official docs to setup cdk: https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install 


- Also, install typescript as mentioned in start of above AWS docs. This is a very detailed doc and self-explanatory.


## Create the APP and Provision Infrastructure

```bash
mkdir myCDKDemoApp
cd myCDKDemoApp
cdk init app --language typescript
```

- From the code dir myCDKDemoApp, copy the lib directory that is inside myCDKDemoApp and paste/replace it in your lib directory inside myCDKDemoApp

- Replace all the constants in constants.ts file inside lib directory according to your feasibility.

- Run the below command to provision the infrastructure,

```bash
cdk deploy
OR
make deploy  (to avoid approval prompt)
```

- App will provision s3 bucket, redshift serverless namespace and workgroup, kms key for data encryption in s3 and iam roles as required.

- Run the below command to destroy the infrastructure but don’t run right now as we need to run other scripts on our provisioned infrastructure. 

```bash
cdk destroy
OR
make destroy  (to avoid approval prompt)
```

## Upload Data to s3

- Follow this repo: https://github.com/abdurrehman11/aws-javascript-sdk-demo (clone it locally)

- Goto root directory `aws-javascript-sdk-demo` and run the following commands,

```bash
cd nodegetstarted
npm install
```

- Now run the below command to upload json data to s3 or delete data from s3,

```bash
node s3_bucket_ops.js upload
node s3_bucket_ops.js delete
```

(you can verify upload data from you s3 bucket)


## Create table in Redshift, Load and Unload data to/from S3

- Run the below command to create table in redshift server

```bash
node redshift_ops.js create
```

- run the below command to load data from s3 to redshift table

```bash
node redshift_ops.js load
```

- run the below command to unload data from redshift to s3 bucket
```bash
node redshift_ops.js unload
```

## Provision Glue Crawler and ETL Job
- Run the following command if you only want to provision AWS glue resources,

```bash
cdk deploy CdkGlueStack
```

- If you want to provision all stack, Run the following command,

```bash
make deploy-all
```

- Similarly run the following command to destroy single or all stacks,
```bash
make destroy CdkGlueStack
make destroy-all
```

## Run Glue Crawler and ETL Job
- From `aws-javascript-sdk-demo` repo, run the following command to execute crawler and job respectively,

```bash
node glue_ops.js crawl
node glue_ops.js run-job
```

## Load Cloudwatch Logs to S3 bucket
- Using `MyCdkDemoAppStack` stack, we have already deployed s3 bucket where we will load the logs. You can change the `start and end date` as required in `cloudwatch_ops.js` file and run the following command,

```bash
node cloudwatch_ops.js
```
  
## Resource Cleaning

In case you want to destroy your aws infra resources, run the below command from myCDKDemoApp dir, 

```bash
cdk destroy
OR
make destroy
```

