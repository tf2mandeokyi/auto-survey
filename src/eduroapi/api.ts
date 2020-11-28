import fetch from 'node-fetch';
import { LoginInfo, ParticipantInfo,  ParticipantPreview, SurveyUser } from './types';
import { JsEncrypt } from '../encrypt/JsEncrypt'
import * as constant from './constant'

const encryptor = new JsEncrypt();
encryptor.setPublicKey(constant.rsaKey);



type HttpMethod = 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace';



export class EduroSurveyApi {
    
    private static url = 'https://goehcs.eduro.go.kr';

    constructor() {}

    private async fetch<T>(method: HttpMethod, dir: string, auth: string, body: object) : Promise<T> {
        let response = await fetch(EduroSurveyApi.url + dir, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            body: JSON.stringify(body)
        });

        if(response.status !== 200) throw response.status;
        
        return await response.json();
    }

    async findUser(loginInfo: LoginInfo) : Promise<SurveyUser> {
        return await this.fetch('post', '/v2/findUser', undefined, {
            birthday: encryptor.encrypt(loginInfo.birthday),
            name: encryptor.encrypt(loginInfo.name),
            orgCode: loginInfo.orgCode,
            loginType: loginInfo.loginType,
            stdntPNo: loginInfo.stdntPNo
        });
    }

    async hasPassword(user: SurveyUser) : Promise<boolean> {
        return await this.fetch('post', '/v2/hasPassword', user.token, {});
    }

    async validatePassword(user: SurveyUser, password: string) : Promise<boolean> {
        return await this.fetch('post', '/v2/hasPassword', user.token, {
            deviceUuid: '',
            password: encryptor.encrypt(password)
        });
    }

    async getParticipantPreviews(user: SurveyUser) : Promise<ParticipantPreview[]> {
        return await this.fetch('post', '/v2/selectUserGroup', user.token, {});
    }
    
    async getParticipantInfo(userPreview: ParticipantPreview) : Promise<ParticipantInfo> {
        return await this.fetch('post', '/v2/getUserInfo', userPreview.token, {
            orgCode: userPreview.orgCode,
            userPNo: userPreview.userPNo
        });
    }
    
    async doSurvey(userInfo: ParticipantInfo) : Promise<any> {
        return await this.fetch('post', '/registerServey', userInfo.token, constant.survey(userInfo.token, userInfo.userName));
    }
}