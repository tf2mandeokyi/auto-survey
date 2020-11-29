import fetch from 'node-fetch';
import { JsEncrypt } from '../encrypt/JsEncrypt'
import * as constant from './constant'

const encryptor = new JsEncrypt();
encryptor.setPublicKey(constant.rsaKey);



type SurveyLoginType = 'school';
type HttpMethod = 'get' | 'post';



export interface LoginInfo {
    orgCode: string;
    birthday: string;
    name: string;
    loginType: SurveyLoginType;
    stdntPNo?: string;
}




export class EduroSurveyApi {
    
    private static url = 'https://goehcs.eduro.go.kr';

    static async fetch(method: HttpMethod, dir: string, auth: string, body?: any) : Promise<any> {
        let response = await fetch(EduroSurveyApi.url + dir, {
            method: method,
            headers: {
                'Content-Type': body ? 'application/json' : undefined,
                'Authorization': auth
            },
            body: JSON.stringify(body)
        });

        if(response.status !== 200) throw response.status;
        
        let data = await response.json();
        return data;
    }

    static async findUser(loginInfo: LoginInfo) : Promise<SurveyUser> {
        return new SurveyUser(await EduroSurveyApi.fetch('post', '/v2/findUser', undefined, {
            birthday: encryptor.encrypt(loginInfo.birthday),
            name: encryptor.encrypt(loginInfo.name),
            orgCode: loginInfo.orgCode,
            loginType: loginInfo.loginType,
            stdntPNo: loginInfo.stdntPNo
        }));
    }

    static async searchSchool(provinceName: string, schoolType: string, name: string) : Promise<SchoolSearchResult> {
        if(!constant.provinces.hasOwnProperty(provinceName)) {
            throw `"${provinceName}" (이)라는 행정 구역이 존재하지 않습니다.`
        }
        if(!constant.schoolType.hasOwnProperty(schoolType)) {
            throw `"${schoolType}" (이)라는 학교급이 존재하지 않습니다. (가능한 학교급들: [유치원, 초등학교, 중학교, 고등학교, 특수학교])`
        }
        return await EduroSurveyApi.fetch('get',
            `/v2/searchSchool?` +
                `lctnScCode=${constant.provinces[provinceName]}&` +
                `schulCrseScCode=${constant.schoolType[schoolType]}&` +
                `orgName=${encodeURI(name)}&` +
                `loginType=school`,
            undefined
        );
    }
}



export interface SchoolSearchResult {
    schulList: School[],
    sizeover: boolean
}



export interface School {
    addres: string
    atptOfcdcConctUrl: string
    engOrgNm: string
    insttClsfCode: string
    juOrgCode: string
    kraOrgNm: string
    lctnScCode: string
    lctnScNm: string
    mdfcDtm: string
    orgAbrvNm01: string
    orgAbrvNm02: string
    orgCode: string
    orgUon: string
    schulKndScCode: string
    sigCode: string
    updid: string
}



export class SurveyUser {
    orgName: string;
    admnYn: string;
    atptOfcdcConctUrl: string;
    mngrClassYn: string;
    pInfAgrmYn: string;
    userName: string;
    stdntYn: string;
    token: string;
    mngrDeptYn: string;

    constructor(obj: SurveyUser) {
        this.orgName = obj.orgName;
        this.admnYn = obj.admnYn;
        this.atptOfcdcConctUrl = obj.atptOfcdcConctUrl;
        this.mngrClassYn = obj.mngrClassYn;
        this.pInfAgrmYn = obj.pInfAgrmYn;
        this.userName = obj.userName;
        this.stdntYn = obj.stdntYn;
        this.token = obj.token;
        this.mngrDeptYn = obj.mngrDeptYn;
    }

    async hasPassword() : Promise<boolean> {
        return await EduroSurveyApi.fetch('post', '/v2/hasPassword', this.token, {});
    }

    async validatePassword(password: string) : Promise<boolean> {
        return await EduroSurveyApi.fetch('post', '/v2/hasPassword', this.token, {
            deviceUuid: '',
            password: encryptor.encrypt(password)
        });
    }

    async getParticipantPreviews() : Promise<ParticipantPreview[]>{
        return (<Array<any>> await EduroSurveyApi.fetch('post', '/v2/selectUserGroup', this.token, {}))
            .map(prev => new ParticipantPreview(prev));
    }
}



export class ParticipantPreview {
    atptOfcdcConctUrl: string;
    lctnScCode: string;
    orgCode: string;
    orgName: string;
    schulCrseScCode: string;
    stdntYn: string;
    token: string;
    userNameEncpt: string;
    userPNo: string;
    wrongPassCnt: number;
    mngrYn: string;
    otherYn: string;

    constructor(obj: ParticipantPreview) {
        this.atptOfcdcConctUrl = obj.atptOfcdcConctUrl;
        this.lctnScCode = obj.lctnScCode;
        this.orgCode = obj.orgCode;
        this.orgName = obj.orgName;
        this.schulCrseScCode = obj.schulCrseScCode;
        this.stdntYn = obj.stdntYn;
        this.token = obj.token;
        this.userNameEncpt = obj.userNameEncpt;
        this.userPNo = obj.userPNo;
        this.wrongPassCnt = obj.wrongPassCnt;
        this.mngrYn = obj.mngrYn;
        this.otherYn = obj.otherYn;
    }

    async getParticipantInfo() : Promise<ParticipantInfo> {
        return new ParticipantInfo(await EduroSurveyApi.fetch('post', '/v2/getUserInfo', this.token, {
            orgCode: this.orgCode,
            userPNo: this.userPNo
        }));
    }
}



export class ParticipantInfo {
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

    constructor(obj: ParticipantInfo) {
        this.atptOfcdcConctUrl = obj.atptOfcdcConctUrl;
        this.lctnScCode = obj.lctnScCode;
        this.orgCode = obj.orgCode;
        this.orgName = obj.orgName;
        this.schulCrseScCode = obj.schulCrseScCode;
        this.stdntYn = obj.stdntYn;
        this.token = obj.token;
        this.userNameEncpt = obj.userNameEncpt;
        this.userPNo = obj.userPNo;
        this.wrongPassCnt = obj.wrongPassCnt;
        this.admnYn = obj.admnYn;
        this.deviceUuid = obj.deviceUuid;
        this.insttClsfCode = obj.insttClsfCode;
        this.isHealthy = obj.isHealthy;
        this.lockYn = obj.lockYn;
        this.mngrClassYn = obj.mngrClassYn;
        this.mngrDeptYn = obj.mngrDeptYn;
        this.pInfAgrmYn = obj.pInfAgrmYn;
        this.registerDtm = obj.registerDtm;
        this.registerYmd = obj.registerYmd;
        this.upperUserName = obj.upperUserName;
        this.userName = obj.userName;
    }

    async doSurvey() : Promise<SurveyResult> {
        return new SurveyResult(await EduroSurveyApi.fetch('post', '/registerServey', this.token, constant.getSurvey(this.token, this.userName)));
    }
}



export class SurveyResult {
    registerDtm: Date;
    inveYmd: Date;
    
    constructor(obj: SurveyResult) {
        this.registerDtm = new Date(obj.registerDtm);
        this.inveYmd = new Date(obj.inveYmd);
    }
}