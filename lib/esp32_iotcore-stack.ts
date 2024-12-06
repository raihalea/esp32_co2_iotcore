import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { IotSql, TopicRule } from "@aws-cdk/aws-iot-alpha";
import { CloudWatchPutMetricAction } from "@aws-cdk/aws-iot-actions-alpha";
import { Metric, Stats } from "aws-cdk-lib/aws-cloudwatch";

export class Esp32IotcoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const namespace = "IoT/Esp32/SensorData";

    new TopicRule(this, "TopicRule", {
      sql: IotSql.fromStringAsVerNewestUnstable(
        "SELECT co2, temperature, humidity FROM 'esp32/sensorData'"
      ),
      actions: [
        new CloudWatchPutMetricAction({
          metricName: "co2",
          metricNamespace: namespace,
          metricUnit: "Count",
          metricValue: "${co2}",
        }),
        new CloudWatchPutMetricAction({
          metricName: "temperature",
          metricNamespace: namespace,
          metricUnit: "Count",
          metricValue: "${temperature}",
        }),
        new CloudWatchPutMetricAction({
          metricName: "humidity",
          metricNamespace: namespace,
          metricUnit: "Percent",
          metricValue: "${humidity}",
        }),
      ],
    });

    const co2Metric = new Metric({
      namespace: namespace,
      metricName: "co2",
      statistic: Stats.MAXIMUM,
      period: cdk.Duration.minutes(1),
    });

    co2Metric.createAlarm(this, "Co2Alarm", {
      threshold: 1000,
      evaluationPeriods: 1,
      alarmName: "CO2 Alert: 1000ppmを超過しました!",
    });
  }
}
