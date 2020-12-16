import { BearerToken, EduroSurveyApi, encryptor } from '../api';
import { ParticipantPreview } from "./ParticipantPreview";

export class SurveyUser {
    orgName: string;
    admnYn: string;
    atptOfcdcConctUrl: string;
    mngrClassYn: string;
    pInfAgrmYn: string;
    userName: string;
    stdntYn: string;
    token: BearerToken;
    private verified: boolean;
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
        this.verified = false;
    }



    private async hasPassword(): Promise<boolean> {
        return await EduroSurveyApi.fetch('post', '/v2/hasPassword', this.token, {});
    }



    async validatePassword(password?: string): Promise<boolean> {
        if(!(await this.hasPassword())) return true;

        let result : (string | object) = await EduroSurveyApi.fetch('post', '/v2/validatePassword', this.token, {
            deviceUuid: '',
            password: encryptor.encrypt(password)
        });

        if(typeof result === 'object') return false;
        this.token = result;
        return this.verified = true;
    }


    
    async getParticipantPreviews(): Promise<ParticipantPreview[]> {
        if(!this.verified) throw 'Password not yet verified. Call validatePassword(password?) first in order to call this method.';
        return (<Array<any>>await EduroSurveyApi.fetch('post', '/v2/selectUserGroup', this.token, {}))
            .map(prev => new ParticipantPreview(prev));
    }
}