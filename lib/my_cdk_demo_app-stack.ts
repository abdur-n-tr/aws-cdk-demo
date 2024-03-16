import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Key, IKey } from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import { aws_redshiftserverless as redshiftserverless } from 'aws-cdk-lib';
import { CfnWorkgroup } from 'aws-cdk-lib/aws-redshiftserverless';


export class MyCdkDemoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // s3-redshift role
    const s3_to_redshift_role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal("redshift.amazonaws.com"),
      roleName: "s3-to-redshift-role"
    });

    s3_to_redshift_role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonRedshiftFullAccess'));
    s3_to_redshift_role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
    s3_to_redshift_role.addManagedPolicy({
      managedPolicyArn: "arn:aws:iam::aws:policy/service-role/ROSAKMSProviderPolicy",
    });

    
    const cfnNamespace = new redshiftserverless.CfnNamespace(this, 'MyCfnNamespace', {
      namespaceName: 'default-namespace-101',

      // the properties below are optional
      dbName: "dev",
      adminUsername: '',
      adminUserPassword: '',
      defaultIamRoleArn: s3_to_redshift_role.roleArn,
      iamRoles: [s3_to_redshift_role.roleArn]
    });

    console.log("==================", cfnNamespace.namespaceName);

    const cfnWorkgroup = new redshiftserverless.CfnWorkgroup(this, 'MyCfnWorkgroup', {
      workgroupName: 'default-workgroup-101',
    
      // the properties below are optional
      namespaceName: cfnNamespace.namespaceName,
      configParameters: [
        {
          parameterKey: 'max_query_execution_time',
          parameterValue: '14400'
        }
      ],
      securityGroupIds: ['sg-056af26c3ba45eb3c'],
      subnetIds: ['subnet-064ee1c4bfe66d286', 'subnet-07661d4d497929542', 'subnet-07aaefb19d8f2b82a'],
      
    });

    cfnWorkgroup.addDependency(cfnNamespace);
    

    const myKMSkeyPolicy = new iam.PolicyDocument({
      statements: [
          new iam.PolicyStatement({
              sid: 'Enable IAM User Permissions',
              effect: iam.Effect.ALLOW,
              principals: [new iam.AccountRootPrincipal()],
              actions: [
                  'kms:*'
              ],
              resources: ['*']
          }),
          new iam.PolicyStatement({
            sid: 'Allow use of the key to Redshift Role',
            effect: iam.Effect.ALLOW,
            principals: [new iam.ArnPrincipal(s3_to_redshift_role.roleArn)],
            actions: [
                'kms:Encrypt',
                'kms:Decrypt',
                'kms:ReEncrypt*',
                'kms:GenerateDataKey*',
                'kms:DescribeKey'
            ],
            resources: ['*']
          })
      ]
    });

    const s3KMSKeyForData = new Key(this, "MyKMSkey", {
      alias: "s3KMSKeyForData",
      enabled: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      policy: myKMSkeyPolicy,
      pendingWindow: cdk.Duration.days(7)
    });

    const level2S3Bucket = new Bucket(this, "Mys3Bucket", {
      bucketName: "s3-cdk-bucket-ar",
      versioned: true,
      encryption: BucketEncryption.KMS,
      encryptionKey: s3KMSKeyForData,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    
  }
}
