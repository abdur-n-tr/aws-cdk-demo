import { 
  PolicyDocument, 
  PolicyStatement, 
  Effect, 
  AccountRootPrincipal, 
  ArnPrincipal,
  ServicePrincipal 
} from 'aws-cdk-lib/aws-iam';

export const createKMSKeyPolicy = (redshiftRoleArn: string): PolicyDocument => {
  return new PolicyDocument({
    statements: [
      new PolicyStatement({
        sid: 'Enable IAM User Permissions',
        effect: Effect.ALLOW,
        principals: [new AccountRootPrincipal()],
        actions: ['kms:*'],
        resources: ['*'],
      }),
      new PolicyStatement({
        sid: 'Allow use of the key to Redshift Role',
        effect: Effect.ALLOW,
        principals: [new ArnPrincipal(redshiftRoleArn)],
        actions: [
          'kms:Encrypt',
          'kms:Decrypt',
          'kms:ReEncrypt*',
          'kms:GenerateDataKey*',
          'kms:DescribeKey',
        ],
        resources: ['*'],
      }),
      new PolicyStatement({
        sid: 'Allow CloudWatch Service Principal usage',
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('logs.us-east-1.amazonaws.com')],
        actions: [
          'kms:Decrypt',
          'kms:GenerateDataKey*',
        ],
        resources: ['*'],
      }),
    ],
  });
};
