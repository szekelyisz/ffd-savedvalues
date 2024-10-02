/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    GQL_URL: string;
    SWARM_API_URL: string;
    PACKAGE_PAGE_URL: string;
  }
}
