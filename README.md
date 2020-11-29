# 소개

자동으로 학생 건강상태 자가진단을 해주는 Typescript로 짜여진 레포지토리이다.

⚠️**주의: 이 스크립트는 학생이 건강하다는 진단만을 자동으로 보내므로, 실행하기 전 반드시 자신의 건강상태를 확인해주시기 바랍니다.**



## 사용 방법

다음 작업들을 수행하기 전 [nodejs](https://nodejs.org/ko/download/)와 [git](https://git-scm.com/downloads)을 먼저 설치해주세요.

1. 이 레포지토리를 다음 커맨드로 다운로드해준다.

   ```bash
   git clone https://github.com/tf2mandeokyi/auto-survey
   cd auto-survey
   ```

2. `credentials.json`이라는 파일을 새로 만들고, 다음과 같이 작성해준다.

   ```json
   {
       "province": "<행정 구역 (시/도)>",
       "schoolName": "<학교>",
       "schoolType": "<학교급>",
       
       "name": "<학생 이름>",
       "birthday": "<생년월일, YYMMDD>"
   }
   ```

   | 키 값        | 설명              | 가능한 타입                                            | 예시           |
   | :----------- | ----------------- | ------------------------------------------------------ | -------------- |
   | `province`   | 행정 구역 (시/도) | "서울특별시", "부산광역시", "대구광역시", ...          | "서울특별시"   |
   | `schoolName` | 학교 이름         | (문자열)                                               | "서울고등학교" |
   | `schoolType` | 학교 급           | "유치원", "초등학교", "중학교", "고등학교", "특수학교" | "고등학교"     |
   | `name`       | 학생 이름         | (문자열)                                               | "홍길동"       |
   | `birthday`   | 생년월일          | YYMMDD                                                 | "040101"       |
   
   🛈 참고: 4자리 비밀번호는 입력할 필요가 없습니다.

3. 현재 레포지토리를 다음 커맨드로 빌드해준다. (한번만 실행)

   ```bash
   # node 모듈 설치
   npm install
   # typescript 설치
   npm install -g typescript
   ```

4. 스크립트를 컴파일해준다.

   ```bash
   # 이 작업은 한번만 해주시고, credentials.json이 수정됐을 때에만 다시 실행하시면 .
   npx tsc
   ```

5. 컴파일된 스크립트를 실행해준다.

   ```
   node index.js
   ```

   
