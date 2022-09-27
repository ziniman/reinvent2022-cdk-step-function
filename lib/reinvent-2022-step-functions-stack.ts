import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { StateMachine } from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Reinvent2022StepFunctionsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const reteLimitFunction = new NodejsFunction(
      this,
      "random-rate-limit-api-call",
      {
        entry: "src/randomFailure.ts", // accepts .js, .jsx, .ts, .tsx and .mjs files
      }
    );

    const flights = new LambdaInvoke(this, "Order flights to vegas", {
      lambdaFunction: reteLimitFunction,
      // Lambda's result is in the attribute `Payload`
      //outputPath: '$.Payload',
    });

    const hotel = new LambdaInvoke(this, "Order Hotel near the venue", {
      lambdaFunction: reteLimitFunction,
      // Lambda's result is in the attribute `Payload`
      //outputPath: '$.Payload',
    });

    const tickets = new LambdaInvoke(this, "Order Tickets to Re:invent2022", {
      lambdaFunction: reteLimitFunction,
      // Lambda's result is in the attribute `Payload`
      //outputPath: '$.Payload',
    });

    const car = new LambdaInvoke(this, "Order Car rental", {
      lambdaFunction: reteLimitFunction,
      // Lambda's result is in the attribute `Payload`
      //outputPath: '$.Payload',
    });

    // .next(new sfn.Choice(this, 'Job Complete?')
    //     // Look at the "status" field
    //     .when(sfn.Condition.stringEquals('$.status', 'FAILED'), jobFailed)
    //     .when(sfn.Condition.stringEquals('$.status', 'SUCCEEDED'), finalStatus)
    //     .otherwise(waitX));

    new StateMachine(this, "iterative-stateMachine", {
      stateMachineName: "iterative-stateMachine",
      definition: flights.next(hotel).next(tickets).next(car),
      timeout: Duration.minutes(5),
    });

  }
}
