import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Key, IKey } from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import { isKeyObject } from 'util/types';

export class MyCdkDemoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // L2 construct for s3 bucket

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
              sid: 'Allow use of the key',
              effect: iam.Effect.ALLOW,
              principals: [new iam.ArnPrincipal('arn:aws:iam::471112663332:user/aws-console-user')],
              actions: [
                  'kms:Encrypt',
                  'kms:Decrypt',
                  'kms:ReEncrypt*',
                  'kms:GenerateDataKey*',
                  'kms:DescribeKey'
              ],
              resources: ['*']
          }),
          new iam.PolicyStatement({
              sid: 'Allow attachment of persistent resources',
              effect: iam.Effect.ALLOW,
              principals: [new iam.ArnPrincipal('arn:aws:iam::471112663332:user/aws-console-user')],
              actions: [
                  'kms:CreateGrant',
                  'kms:ListGrants',
                  'kms:RevokeGrant'
              ],
              resources: ['*'],
              conditions: {
                  Bool: {
                      'kms:GrantIsForAWSResource': 'true'
                  }
              }
          })
      ]
    });

    const cdkAWSKmsKey = new Key(this, "MyKMSkey", {
      alias: "cdkKMSTestKey",
      enabled: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      policy: myKMSkeyPolicy,
      pendingWindow: cdk.Duration.days(7)
    });

    const level2S3Bucket = new Bucket(this, "Mys3Bucket", {
      bucketName: "s3-cdk-bucket-ar",
      versioned: true,
      encryption: BucketEncryption.KMS,
      encryptionKey: cdkAWSKmsKey,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    
  }
}
