export const status = {
  raisedByUser: 1.0, //
  underUnitHr: 2.0, //
  rejectedByUnitHr: 3.0, //
  underCgm: 4.0, //
  rejectedByCgm: 5.0, //
  cgmToCorporate: 6.0, //
  underCorporateHr: 7.0, //
  rejectedByCorporateHr: 8.0,
  underDandAr: 9.0,
  vigilanceToDandr: 9.1,
  revertBackToHr: 10.0,
  sentToVigilanceUser: 11.0,
  sentToCvo: 12.0,
  cvoToHr: 13.0,
  hrToGmHr: 14.0,
  gmHrApproved: 15.0,
  gmHrNotApproved: 16.0,
  gmHrToGmCadre: 16.1,
  gmCadreApproved: 16.2,
  gmCadreNotApproved: 16.3,
  actionCompleted: 17.0,
};
export class RequestStatus {
  static readonly RejectedStatus: number[] = [3.0, 5.0, 8.0, 16.0, 16.3];

  static readonly RaisedByUser = new RequestStatus(1.0, 'Raised By User');
  static readonly UnderUnitHR = new RequestStatus(2.0, 'Under Unit HR');
  static readonly RejectedByUnitHR = new RequestStatus(3.0, 'Rejected By Unit HR');
  static readonly UnderCGM = new RequestStatus(4.0, 'Under CGM');
  static readonly RejectedByCGM = new RequestStatus(5.0, 'Rejected By CGM');
  static readonly CGMtoCorporate = new RequestStatus(6.0, 'CGM to Corporate');
  static readonly UnderCorporateHR = new RequestStatus(7.0, 'Under Corporate HR');
  static readonly RejectedByCorporateHR = new RequestStatus(8.0, 'Rejected By Corporate HR');
  static readonly UnderDandAR = new RequestStatus(9.0, 'Under DandAR');
  static readonly RevertBackToUnderDandAR = new RequestStatus(9.1, 'VigilanceToDandr');
  static readonly RevertBackToHR = new RequestStatus(10.0, 'Revert Back to HR');
  static readonly SentToVigilanceUser = new RequestStatus(11.0, 'Sent to Vigilance User');
  static readonly SentToCVo = new RequestStatus(12.0, 'Sent to CVo');
  static readonly CVOTOHR = new RequestStatus(13.0, 'CVO to HR');
  static readonly HRTOGMHR = new RequestStatus(14.0, 'HR to GM HR');
  static readonly GMHRAccepted = new RequestStatus(15.0, 'GM HR Approved');
  static readonly GMHRRejected = new RequestStatus(16.0, 'GM HR Not Approved');
  static readonly GMHRTOGGM = new RequestStatus(16.1, 'GM HR to GM Cadre');
  static readonly GGMAccepted = new RequestStatus(16.2, 'GM Cadre Approved');
  static readonly GGMRejected = new RequestStatus(16.3, 'GM Cadre Not Approved');
  static readonly ParkedFile = new RequestStatus(17.0, 'Action Completed');

  readonly value: number;
  readonly name: string;

  private constructor(value: number, name: string) {
    this.value = value;
    this.name = name;
  }

  toString(): string {
    return this.name;
  }

  static getAllStatuses(): RequestStatus[] {
    return [
      RequestStatus.RaisedByUser,
      RequestStatus.UnderUnitHR,
      RequestStatus.RejectedByUnitHR,
      RequestStatus.UnderCGM,
      RequestStatus.RejectedByCGM,
      RequestStatus.CGMtoCorporate,
      RequestStatus.UnderCorporateHR,
      RequestStatus.RejectedByCorporateHR,
      RequestStatus.UnderDandAR,
      RequestStatus.RevertBackToUnderDandAR,
      RequestStatus.RevertBackToHR,
      RequestStatus.SentToVigilanceUser,
      RequestStatus.SentToCVo,
      RequestStatus.CVOTOHR,
      RequestStatus.HRTOGMHR,
      RequestStatus.GMHRAccepted,
      RequestStatus.GMHRRejected,
      RequestStatus.GMHRTOGGM,
      RequestStatus.GGMAccepted,
      RequestStatus.GGMRejected,
      RequestStatus.ParkedFile,
    ];
  }
}
