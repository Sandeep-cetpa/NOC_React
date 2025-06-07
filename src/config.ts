const DFCCIL_UAT = {
  apiUrl: 'https://uattaskmanageapi.dfccil.com/api',
  orgHierarchy: 'https://uatorganization.dfccil.com/api',
  logoutUrl: 'http://uatlogin.dfccil.com/applications',
  authUrl: 'https://app2.dfccil.com',
  clientId: 'd59a787020d841469a71107917549ef3',
  postLogout: 'https://uatlogin.dfccil.com/signout',
  redirectPath: 'create-request',
  applicationId: 8,
};

const DFCCIL_PROD = {
  apiUrl: 'https://taskmanagementservices.dfccil.com/api',
  orgHierarchy: 'https://orgsvc.dfccil.com/api',
  logoutUrl: 'https://it.dfccil.com/Home/Home',
  authUrl: 'https://app2.dfccil.com',
  clientId: 'd59a787020d841469a71107917549ef3',
  postLogout: 'https://uatlogin.dfccil.com/signout',
  redirectPath: 'create-request',
  applicationId: 8,
};

export const ManualUrl = './TaskManagementSystem.pdf';

export const environment = import.meta.env.VITE_ENV === 'production' ? DFCCIL_PROD : DFCCIL_UAT;
