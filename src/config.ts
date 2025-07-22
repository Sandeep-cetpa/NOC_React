const DFCCIL_UAT = {
  apiUrl: 'https://uatnocapi.dfccil.com/api',
  imagesBaseUrl: 'https://uat.dfccil.com/DocUpload',
  orgHierarchy: 'https://uatorganization.dfccil.com/api',
  logoutUrl: 'https://uatlogin.dfccil.com/applications',
  authUrl: 'https://app2.dfccil.com',
  clientId: 'd59a787020d841469a71107917549ef3',
  postLogout: 'https://uatlogin.dfccil.com/signout',
  redirectPath: 'create-request',
  applicationId: 18,
  FileBaseUrl: 'https://uatnocapi.dfccil.com/Upload/Vigilance',
};

const DFCCIL_PROD = {
  apiUrl: 'https://uatnocapi.dfccil.com/api',
  orgHierarchy: 'https://orgsvc.dfccil.com/api',
  FileBaseUrl: 'https://uatnocapi.dfccil.com/Upload/Vigilance',
  imagesBaseUrl: 'https://uat.dfccil.com/DocUpload',
  logoutUrl: 'https://it.dfccil.com/Home/Home',
  authUrl: 'https://app2.dfccil.com',
  clientId: 'd59a787020d841469a71107917549ef3',
  postLogout: 'https://uatlogin.dfccil.com/signout',
  redirectPath: 'create-request',
  applicationId: 18,
};
export const hiddenFieldsForNewPaasport = [123, 124, 125, 126];
export const hiddenFieldsForExIndiaLeaveSponsored = [135, 136, 137];
export const hiddenFieldsForExIndiaLeaveThirdParty = [136];
export const gradeHierarchy = [
  { label: 'MD', order: 1 },
  { label: 'CV', order: 2 },
  { label: 'DR', order: 3 },
  { label: 'E9', order: 4 },
  { label: 'E8', order: 5 },
  { label: 'E81', order: 5 },
  { label: 'E7', order: 7 },
  { label: 'E6', order: 8 },
  { label: 'E5', order: 9 },
  { label: 'E4', order: 10 },
  { label: 'E3', order: 11 },
  { label: 'E2', order: 12 },
  { label: 'E1', order: 13 },
  { label: 'E0', order: 14 },
  { label: 'N7', order: 15 },
  { label: 'N6', order: 16 },
  { label: 'N5', order: 17 },
  { label: 'N4', order: 18 },
  { label: 'N3', order: 19 },
  { label: 'N2', order: 20 },
  { label: 'N1', order: 21 },
];

export const ManualUrl = './TaskManagementSystem.pdf';
export const SESSION_CHECK_INTERVAL = 20 * 60 * 1000;
export const environment = import.meta.env.VITE_ENV === 'production' ? DFCCIL_PROD : DFCCIL_UAT;
