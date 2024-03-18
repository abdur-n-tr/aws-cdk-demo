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
            path: 's3://aws-bootcamp-store-data/employee_data/',
          }],
        },
        databaseName: constants.GLUE_DB_NAME,
        description: 'Sample crawler to extract data from s3 bucket',
        name: constants.GLUE_CRAWLER_NAME,
        recrawlPolicy: {
          recrawlBehavior: 'CRAWL_EVERYTHING'
        }
      });

    }
}