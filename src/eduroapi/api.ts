import fetch from 'node-fetch';
import { JsEncrypt } from '../encrypt/JsEncrypt'
import * as constant from './constant'

const encryptor = new JsEncrypt();
encryptor.setPublicKey(constant.rsaKey);



type SurveyLoginType = 'school';



export interface LoginInfo {
    orgCode: string;
    birthday: string;
    name: string;
    loginType: SurveyLoginType;
    stdntPNo?: string;
}




export class EduroSurveyApi {
    
    private static url = 'https://goehcs.eduro.go.kr';

    static async post(dir: string, auth: string, body: object) : Promise<any> {
        let response = await fetch(EduroSurveyApi.url + dir, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            body: JSON.stringify(body)
        });

        if(response.status !== 200) throw response.status;
        
        return await response.json();
    }

    static async findUser(loginInfo: LoginInfo) : Promise<SurveyUser> {
        return new SurveyUser(await EduroSurveyApi.post('/v2/findUser', undefined, {
            birthday: encryptor.encrypt(loginInfo.birthday),
            name: encryptor.encrypt(loginInfo.name),
            orgCode: loginInfo.orgCode,
            loginType: loginInfo.loginType,
            stdntPNo: loginInfo.stdntPNo
        }));
    }
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
        return await EduroSurveyApi.post('/v2/hasPassword', this.token, {});
    }

    async validatePassword(password: string) : Promise<boolean> {
        return await EduroSurveyApi.post('/v2/hasPassword', this.token, {
            deviceUuid: '',
            password: encryptor.encrypt(password)
        });
    }

    async getParticipantPreviews() : Promise<ParticipantPreview[]>{
        return (<Array<any>> await EduroSurveyApi.post('/v2/selectUserGroup', this.token, {}))
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
        return new ParticipantInfo(await EduroSurveyApi.post('/v2/getUserInfo', this.token, {
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

    async doSurvey() : Promise<any> {
        return await EduroSurveyApi.post('/registerServey', this.token, constant.getSurvey(this.token, this.userName));
    }
}