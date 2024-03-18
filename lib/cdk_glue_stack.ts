import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_glue as glue } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as constants from './constants';

export class CdkGlueStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      const glueCrawlerRole = new iam.Role(this, 'glueCrawlerRrole', {
        assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
        roleName: constants.GLUE_CRAWLER_ROLE_NAME,
      });

      glueCrawlerRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
      glueCrawlerRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'));
      glueCrawlerRole.addManagedPolicy({
        managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole',
      });

      const glueDatabase = new glue.CfnDatabase(this, 'glueDatabase', {
        catalogId: '471112663332',
        databaseInput: {
          name: constants.GLUE_DB_NAME,
        }
      });

      const glueCrawler = new glue.CfnCrawler(this, 'glueCrawler', {
        role: glueCrawlerRole.roleArn,
        targets: {
          s3Targets: [{
            path: 's3://s3-glue-bucket-ar/employee_data/',
          }],
        },
        databaseName: constants.GLUE_DB_NAME,
        description: 'Sample crawler to extract data from s3 bucket',
        name: constants.GLUE_CRAWLER_NAME,
        recrawlPolicy: {
          recrawlBehavior: 'CRAWL_EVERYTHING'
        }
      });

      const glueJob = new glue.CfnJob(this, 'glueJob', {
        name: constants.GLUE_JOB_NAME,
        description: 'Glue job to read from s3, perform transformations, and write to s3',
        role: glueCrawlerRole.roleArn,
        command: {
          name: 'glueetl',
          pythonVersion: '3',
          scriptLocation: 's3://s3-glue-bucket-ar/scripts/glue_employee_job.py',
        },
        glueVersion: '3.0',
        workerType: 'G.1X',
        numberOfWorkers: 10,
        maxRetries: 0,
        timeout: 10,
        executionClass: 'FLEX',
        defaultArguments: {
          "--enable-continuous-cloudwatch-log": true,
          "--enable-observability-metrics": true,
          "--enable-metrics": true,
          "--enable-spark-ui": true,
          "--spark-event-logs-path": "s3://s3-glue-bucket-ar/spark-logs/",
          "--TempDir": "s3://s3-glue-bucket-ar/temp/"
        }
      });

    }
}