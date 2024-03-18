deploy:
	cdk deploy --require-approval never

deploy-all:
	cdk deploy --all --require-approval never

destroy:
	cdk destroy --force

destroy-all:
	cdk destroy --all --force