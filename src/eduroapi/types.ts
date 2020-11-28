export interface ParticipantPreview {
    atptOfcdcConctUrl: string
    lctnScCode: string
    orgCode: string
    orgName: string
    schulCrseScCode: string
    stdntYn: string
    token: string
    userNameEncpt: string
    userPNo: string
    wrongPassCnt: number
    mngrYn: string
    otherYn: string
}



export interface ParticipantInfo {
    atptOfcdcConctUrl: string
    lctnScCode: string
    orgCode: string
    orgName: string
    schulCrseScCode: string
    stdntYn: string
    token: string
    userNameEncpt: string
    userPNo: string
    wrongPassCnt: number
    admnYn: string
    deviceUuid: string
    insttClsfCode: string
    isHealthy: boolean
    lockYn: string
    mngrClassYn: string
    mngrDeptYn: string
    pInfAgrmYn: string
    registerDtm: string
    registerYmd: string
    upperUserName: string
    userName: string
}



export interface SurveyUser {
    orgName: string,
    admnYn: string,
    atptOfcdcConctUrl: string,
    mngrClassYn: string,
    pInfAgrmYn: string,
    userName: string,
    stdntYn: string,
    token: string,
    mngrDeptYn: string
}



type SurveyLoginType = 'school';



export interface LoginInfo {
    orgCode: string;
    birthday: string;
    name: string;
    loginType: SurveyLoginType;
    stdntPNo?: string;
}