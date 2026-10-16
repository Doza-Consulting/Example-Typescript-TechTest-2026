/**
 * AWS Lambda entry point. Wraps the Express app behind a Lambda Function URL.
 * CloudFront forwards /api/* to this function, so the prefix is stripped.
 */

import serverless from "serverless-http";

import { createApp } from "./app";

export const handler = serverless(createApp(), { basePath: "/api" });
