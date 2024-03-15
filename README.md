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

## Requirements & Setup 
- Follow the instruction from AWS official docs here: - https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install

- Node version > 20.0

- Download node from official website and then execute below command from the directory where node download file is present,

```bash
tar -xvf node-v20.11.1-linux-x64.tar
sudo mv node-v20.11.1-linux-x64 /usr/local/
sudo ln -sf /usr/local/node-v20.11.1-linux-x64/bin/node /usr/bin/node
sudo ln -sf /usr/local/node-v20.11.1-linux-x64/bin/npm /usr/bin/npm
sudo ln -sf /usr/local/node-v20.11.1-linux-x64/bin/npx /usr/bin/npx
```

- After successful setup, run `cdk --version` to verify the installation.

## Resources
- https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html
- https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html

