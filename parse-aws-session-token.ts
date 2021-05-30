import { BufReader } from "https://deno.land/std@0.97.0/io/bufio.ts";
import { TextProtoReader } from "https://deno.land/std@0.97.0/textproto/mod.ts";

export interface AwsCredentials {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  Expiration: string;
}

export interface AwsCredentialsContainer {
  Credentials: AwsCredentials;
}

const reader = new TextProtoReader(new BufReader(Deno.stdin));

const lines: string[] = [];

for (
  let line = await reader.readLine();
  line != null;
  line = await reader.readLine()
) {
  lines.push(line);
}
try {
  const { Credentials: credentials } = JSON.parse(
    lines.join("\n"),
  ) as AwsCredentialsContainer;

  console.log(`export AWS_ACCESS_KEY_ID=${credentials.AccessKeyId}`);
  console.log(`export AWS_SECRET_ACCESS_KEY=${credentials.SecretAccessKey}`);
  console.log(`export AWS_SESSION_TOKEN=${credentials.SessionToken}`);
  console.log(
    `echo "logged in as \`aws sts get-caller-identity --query 'Arn'\`"`,
  );
} catch {
  console.log(`echo "Invalid MFA"`);
}
