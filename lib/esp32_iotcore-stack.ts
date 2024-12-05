import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
=import { IotSql, TopicRule } from "@aws-cdk/aws-iot-alpha";
import { CloudWatchPutMetricAction } from "@aws-cdk/aws-iot-actions-alpha";

export class Esp32IotcoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new TopicRule(this, "TopicRule", {
      sql: IotSql.fromStringAsVerNewestUnstable(
        "SELECT co2, temperature, humidity FROM 'esp32/sensorData'"
      ),
      actions: [
        new CloudWatchPutMetricAction({
          metricName: "co2",
          metricNamespace: "IoT/Esp32/SensorData",
          metricUnit: "Count",
          metricValue: "${co2}",
        }),
        new CloudWatchPutMetricAction({
          metricName: "temperature",
          metricNamespace: "IoT/Esp32/SensorData",
          metricUnit: "Count",
          metricValue: "${temperature}",
        }),
        new CloudWatchPutMetricAction({
          metricName: "humidity",
          metricNamespace: "IoT/Esp32/SensorData",
          metricUnit: "Percent",
          metricValue: "${humidity}",
        }),
      ],
    });
  }
}
