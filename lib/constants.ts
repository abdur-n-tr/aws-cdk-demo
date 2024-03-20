// Replace all the constant as per your created attributes
// You can replace security group and subnet ids with the default aws account or can create new ones

export const BUCKET_NAME = 's3-cdk-bucket-ar';
export const NAMESPACE_NAME = 'default-namespace-101';
export const WORKGROUP_NAME = 'default-workgroup-101';
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'Temp123456';
export const SECURITY_GROUP_IDS = ['sg-056af26c3ba45eb3c'];
export const SUBNET_IDS = ['subnet-064ee1c4bfe66d286', 'subnet-07661d4d497929542', 'subnet-07aaefb19d8f2b82a'];
export const DB_NAME = 'dev';
export const KMS_ALIAS = 's3KMSKeyForData';
export const ROLE_NAME = 's3-to-redshift-role';
export const GLUE_DB_NAME = 'sampledb';
export const GLUE_CRAWLER_NAME = 'employee_crawler';
export const GLUE_CRAWLER_ROLE_NAME = 'glue_crawler_test_role';
export const GLUE_JOB_NAME = 'glue_employee_job';
export const CLOUDWATCH_BUCKET_NAME = 'ar-test-cloudwatch-logs';
