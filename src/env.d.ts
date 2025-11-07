/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      username: string;
      displayname?: string;
      email?: string;
      // Add other farmer properties from your Loopback farmers model as needed
    };
  }
}

interface ImportMetaEnv {
  readonly ASB_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}