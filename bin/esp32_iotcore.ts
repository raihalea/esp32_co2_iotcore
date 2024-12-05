#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Esp32IotcoreStack } from "../lib/esp32_iotcore-stack";

const app = new cdk.App();
new Esp32IotcoreStack(app, "Esp32IotcoreStack", {
  env: { region: "us-east-1" },
});
