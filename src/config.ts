const DFCCIL_UAT = {
  apiUrl: 'https://uattaskmanageapi.dfccil.com/api',
  orgHierarchy: 'https://uatorganization.dfccil.com/api',
  logoutUrl: 'http://uat.dfccil.com/DfcHome',
  powerOffUrl: 'http://localhost',
};

const PROD_DFCCIL = {
  apiUrl: 'https://vmsapi.dfccil.com/api',
  orgHierarchy: 'https://orgsvc.dfccil.com/api',
  logoutUrl: 'https://it.dfccil.com/Home/Home',
  powerOffUrl: 'http://localhost',
};

export const environment = DFCCIL_UAT;
