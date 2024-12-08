import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { Construct } from 'constructs';

export class NextAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda Function
    const apiFunction = new lambda.Function(this, 'BreweriesFunction', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'app.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/api')), // Simplified asset loading
      timeout: cdk.Duration.seconds(30),
      environment: {
        PYTHONPATH: '/var/runtime:/var/task/lib'
      }
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'BreweriesApi', {
      restApiName: 'Breweries API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Add proxy resource to API Gateway
    const integration = new apigateway.LambdaIntegration(apiFunction);
    api.root.addProxy({
      defaultIntegration: integration,
    });

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}