export interface Environments {
  accountId: string;
  stage: string;
  region: string;
  tableA: string;
}

export const ENV_VARS: Environments = {
  accountId: process.env.ACCOUNT_ID,
  stage: process.env.STAGE,
  region: process.env.REGION,
  tableA: process.env.TABLE_A,
};
