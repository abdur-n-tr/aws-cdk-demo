import { PolicyStatement, Effect, AnyPrincipal, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export const createLambdaPolicy = (bucketArn: string): PolicyStatement => {
    return new PolicyStatement({
        sid: "Allow Lambda to put objects in the bucket",
        effect: Effect.ALLOW,
        actions: ['s3:PutObject'],
        resources: [`${bucketArn}/*`],
        principals: [new ServicePrincipal('lambda.amazonaws.com')], // Allow Lambda to put objects
    });
};

export const createCloudWatchPolicy = (bucketArn: string): PolicyStatement => {
    return new PolicyStatement({
        sid: "Allow Cloudwatch to get and list the bucket",
        effect: Effect.ALLOW,
        actions: ['s3:GetBucketAcl', 's3:ListBucket'],
        resources: [bucketArn],
        principals: [new ServicePrincipal('logs.amazonaws.com')], // Allow CloudWatch to access bucket
    });
};

export const createNonSecureCloudwatchLogPolicy = (bucketArn: string): PolicyStatement => {
    return new PolicyStatement({
        sid: 'Cloudwatch Log Export',
        effect: Effect.ALLOW,
        actions: ["s3:*"],
        resources: [`${bucketArn}/*`],
        principals: [new AnyPrincipal()],
        conditions: {
            "Bool": { "aws:SecureTransport": false }
        }
    });
}

export const createCloudwatchLogsPolicy = (bucketArn: string): PolicyStatement => {
    return new PolicyStatement({
        sid: 'Cloudwtach logs export 1',
        effect: Effect.ALLOW,
        actions: ["s3:GetBucketAcl", "s3:PutObject", "s3:GetObject", "s3:ListBucket"],
        resources: [`${bucketArn}/*`, bucketArn],
        principals: [new ServicePrincipal('logs.amazonaws.com')],
        conditions: {
            "StringLike": { "aws:SourceAccount": ["168427128999", "387009947888", "624167633678"] }
        }
  })
};

