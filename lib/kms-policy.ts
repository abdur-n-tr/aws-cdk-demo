import { PolicyDocument, PolicyStatement, Effect, AccountRootPrincipal, ArnPrincipal } from 'aws-cdk-lib/aws-iam';

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
    ],
  });
};
