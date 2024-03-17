import { PolicyStatement, Effect, PolicyDocument, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

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

