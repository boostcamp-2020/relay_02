# Skylove (스카이러브)

스카이러브 채팅 웹사이트입니다.  
데모 URL: http://49.50.160.97:3000/  

## 스크린샷

|로그인 화면|
|:--:|
|![index](https://user-images.githubusercontent.com/48251136/89639539-b4780c00-d8e8-11ea-8a19-f71b99cad83b.png)<br>|
|로비 채팅 룸|
|![chat](https://user-images.githubusercontent.com/48251136/89639536-b346df00-d8e8-11ea-8476-b8894b345aec.png)<br>|
|1대1 매칭 채팅 룸|
|![match](https://user-images.githubusercontent.com/48251136/89639540-b510a280-d8e8-11ea-9d2f-2933ca1353e3.png)<br>|


## 시나리오

- [ ] 0. 회원가입을 합니다. (선택)
- [x] 1. ID, PW를 입력하여 로그인을 합니다. (필수 - 기능 A)
- [x] 2. 왼쪽에 프로필 사진을 추가합니다. (필수 - 기능 B)
	- [ ] 2-2. 프로필 설정을 수정할 수도 있어요. (필수 - 기능 C)
- [x] 3. 가운데 공간에서 스카이러브가 상대를 추천해줍니다. (필수 - 기능 A, C)
- [ ] 4. 왼쪽의 사람(리스트)를 클릭하면, 오른쪽에 상대방의 프로필이 나옵니다. (필수 - 기능 A, C / 선택 - 기능 B, 프로필 이미지 가리기 기능)
- [ ] 5. 상대방의 프로필 설명에는 스카이러브의 추천 이유가 포함됩니다. (선택 - 기능 C)
- [x] 6. *추천 리스트에 있는 상대를 클릭하고*, 들어가기 버튼(Match Room)을 누르면 채팅방으로 입장합니다.  (필수 - 기능 A) -> **Match Room을 통해 자동 입장으로 변경**
- [x] 7. 채팅이 이루어지고 나면, 언행점수가 변화합니다. (필수 - 기능 A) 채팅을 통해 얻은 자연어를 기반으로 단어 파싱을 진행하여 & 긍정/부정을 인식을 통해 사용자의 성향을 파악합니다.  -> **사용자 점수만 현재 추출(NLP), 추후 DB에 추가 필요**
- [x] 8. 채팅에서 나가려면 나가기 버튼을 클릭합니다. (필수 - 기능 A)


## 기획서

#### [Link](https://github.com/boostcamp-2020/relay_02/blob/master/%EA%B8%B0%ED%9A%8D%EC%84%9C.md)

## 1. DB
DB 확인용 스크립트
```
cd chatapp
node db/dbtest.js # 반드시 위치여야합니다!
```

### 기술 스택
- 기본적인 환경은 채팅 서버와 동일 (채팅 서버의 package.json 참고)
- db: SQLIite3 (설치 방법: npm install sqlite3)
- db 파일명: chat.db

### 스키마

![image](https://user-images.githubusercontent.com/43347250/89639209-1ab05f00-d8e8-11ea-9005-5d8628255819.png)

#### TABLE 01 : log
Column (log_id(pk), timestamp, user_id, message)

[참고사항]
- log.user_id는 user.nickname을 참조하는 외래키입니다.

❗️1주차 기준 제약 조건을 실제 db에 제약조건이 구현되지는 않은 상태입니다.
필요에 따라 구현을 하셔도 무방합니다.

❗️1주차 기준 둘을 연동해서 사용하지 않기 때문에, log의 user_id에 채팅에 들어올 때 입력한 유저명이 담기게 설정되어 있습니다.


#### TABLE 02 : user
Column (user_id(pk), gender, nickname)

[참고사항]
- 1주차 기준 프로그램에서 조회하고 있지 않습니다. 추후 중복 유저 로그인 방지나 유저를 특정해야하거나, 유저의 성별 등을 조회할 때 사용하실 수 있습니다. 
- nickname은 실제 채팅에 접속할 때 유저가 입력한 유저명입니다. user_id는 Primary Key로 auto increment 되는 값이기 때문에 구분하여 사용 부탁 드립니다.


### Chat 모듈 구성

#### 모듈 로드 및 사용
```javascript
const PATH = 'your path';
const { User, ChattingLog, closeDatabase } = require(`${PATH}/chat`);

const user = new User();
const logger = new ChattingLog();

/* ... */
closeDatabase();    // 필수
```

#### User 클래스 함수
1. `insert(gender, nickname)` : 성별과 닉네임을 받아 `user` 테이블에 저장
2. `findByUserId(user_id)` : `PK`로 유저의 `row`를 찾아 반환
3. `findAll()` : 유저 테이블의 모든 행을 반환
4. `update(user_id, gender, nickname)` : `user_id`에 해당하는 `row`의 `gender` 값과 `nickname` 값을 전달인자의 값으로 대체
6. `deleteById(user_id)` : `user_id`에 해당하는 `row`를 삭제


#### ChattingLog 클래스 함수
1. `insert(user_id, message)` : `user_id`와 `message`를 받아 `log` 테이블에 저장 
  - => `user` 현재는 테이블과의 관계가 딱히 없기 때문에 일부러 `user_id` 대신 `nickname`을 활용해 저장하였다. `sqlite3`은 테이블 생성시 선언한 컬럼의 타입을 체크하지 않는다.

2. `findByUserId(user_id)` : `user_id`에 해당하는 채팅 로그를 전부 찾아서 반환 
3. `findAll()` : 채팅 로그 테이블의 모든 행을 반환
4. `update(log_id, user_id, message)` : `log_id`에 해당하는 `row`의 `user_id` 값과 `message` 값을 전달인자의 값으로 대체
5. `deleteById(log_id)` : `log_id`에 해당하는 `row`를 삭제

### Wiki: [Link로 이동하기](https://github.com/boostcamp-2020/relay_02/wiki/DB-%EA%B0%80%EC%9D%B4%EB%93%9C)


## 2. Chat App

### 설치 및 실행

```bash
cd chatapp
npm install # express moment socket.io sqlite3

npm run dev # start dev-server
npm start # start server
```

### Documentation

|Filename|Desc|Docs|
|--|--|--|
|`server.js`|서버 파일| https://github.com/boostcamp-2020/relay_02/issues/6|
|`main.js`|채팅 클라이언트 파일|https://github.com/boostcamp-2020/relay_02/issues/7|
|`index.html` `chat.html` | 웹사이트 파일 |https://github.com/boostcamp-2020/relay_02/issues/8|


## 3. 기능 A. 대화 패턴 긍정도 분석
> 링크: https://github.com/boostcamp-2020/relay_02/tree/master/NLP


### dataset

[네이버 영화 리뷰 데이터]([https://github.com/e9t/nsmc/](https://github.com/e9t/nsmc/))

![](https://lh4.googleusercontent.com/MlW1Tt2PLMIBDRTSEkRoWS1jgJwrvdzHSxD6Um7n9eF3eTtobmv2hdds0YjhH0EhATsTYrnufSYrdtZFTta4mn0uazNdu8bPv1kB4u4iWNI3q9KB5R_FvdBLRDZuY7EYv2s3t-vM)


- 이 데이터셋은 네이버 영화의 리뷰 중 영화당 100개의 리뷰를 모아 총 200,000개의 리뷰(train: 15만, test: 5만)로 이루어져있다.
- 1 ~ 10점까지의 평점 중에서 중립적인 평점(5 ~ 8점)은 제외하고 1 ~ 4점을 긍정으로, 9 ~ 10점을 부정으로 동일한 비율로 데이터에 포함되었다.

- 데이터는 다음과 같이 id, document, label 세 개의 열로 이루어져있다.
- id는 리뷰의 고유한 key 값이고, document는 리뷰의 내용, label은 긍정(0)인지 부정(1)인지를 나타냅니다.

![](https://lh4.googleusercontent.com/8Llw4q-RwHCUPAuCTTT1jB1jvy50BY6zzqnhb1XIvQ_B5bSqqeED81OZ2wpAKLaNdIOBdYz0zqhpgsdodbf1-r4-gJHUnYDKRNMUJwt4G3F7qhqW4DLJxHZ_3FwqNKybaXNvQ0jz)

### 환경설정

-   `Python3`
    
-   `konlpy` : 한국어 정보처리를 위한 파이썬 패키지. Okt를 사용하여 형태소를 분석한국어 정보처리
    
-   `nltk` : 데이터 전처리 과정을 위한 라이브러리
    
-   `tensorflow` : 머신러닝 오픈소스
    
-   `matplotlib` : 시각화 도구
    
-   `numpy` : 수학 연산(배열, 통계, 행렬)을 위한 패키지
    

### 각 함수들에 대한 입출력

####   `read_data(filename)`
-   입력
	```
	준영		아침임니다ㅎ
	하요		좋은아침입니다!
	람다		서버리스 좋은 아침입니다
	```
	> `username(or PK) 대화내용` 형식의 txt 파일을 입력으로 받는다.

-   출력
	```
	[['준영 아침임니다ㅎ'], ['하요 좋은아침입니다!'], ['람다 서버리스 좋은 아침입니다']]
	```
	> 유저의 이름과 대화 내용이 리스트로 저장되어 있는 리스트가 반환된다.


#### `tokenize(doc)`
   -   데이터에 형태소 분석을 통해서 품사를 태깅해주는 작업
```python
OUTPUT:

[['아/Exclamation',

'사람/Noun',

'../Punctuation',

'진짜/Noun',

'짜증나다/Adjective',

'목소리/Noun'],

'0']
```

#### `term_frequency(doc)`

-   Nltk library를 이용하여

####   `predict_pos_neg(review)`
-   입력 : 점수 매기기를 원하는 문장
	```
	"올해 최고의 영화! 세 번 넘게 봐도 질리지가 않네요."
	"배경 음악이 영화의 분위기랑 너무 안 맞았습니다. 몰입에 방해가 됩니다."
	"주연 배우가 신인인데 연기를 진짜 잘 하네요. 몰입감 ㅎㄷㄷ"
	```
-   출력 : 매겨진 점수를 반환한다. 이때 점수의 범위는 (-1,1)이다.

#### `read_chat_data(filename)`
- 입력 : 대화가 기록되어 있는 txt 파일을 입력받는다. 이때 txt 파일 안의 구조는 한 줄당 사람이름과 채팅의 한 입력이 tab으로 나누어져있는 형태이다.
-  출력 : tab키로 나누어진 배열들의 배열이 반환된다. 예를 들어, [[‘철수', ‘안녕? 반가워.’], [‘영희', ‘안녕~’]] 과 같은 형식이다.

####  `make_score_dictionary(data)`
- 입력 : read_chat_data에서 반환된 배열들의 배열을 입력받는다. 세부적인 형식은 위 항목에서 기술한 바와 같다.
- 출력 : 사람의 이름(혹은 nickname)이 key이고, 해당 사람이 친 채팅에 대한 점수들의 배열이 value인 dictionary가 반환된다.

####  `make_average_score_dictionary(score_dictionary)`
- 입력 : make_score_dictionary에서 반환한 dictionary를 입력받는다. 세부적인 형식은 위 항목에서 기술한 바와 같다.
- 출력 : 사람의 이름(혹은 nickname)이 key이고, 해당 사람이 친 채팅에 대한 점수들의 평균값이 value인 dictionary가 반환된다.

### 정리


[네이버 영화 리뷰 데이터](https://github.com/e9t/nsmc/)

![](https://wikidocs.net/images/page/44249/navermovie1.PNG)

+ 모델은 앞서 설명한 데이터셋을 기반으로 `tensorflow`를 활용하여 text를 학습시킨 후 긍/부정을 예측하는 알고리즘을 만들었다.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0df4b8ab-df53-4263-8491-f17440cd4e4d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20200807%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200807T101823Z&X-Amz-Expires=86400&X-Amz-Signature=92703530189d697a6626fe8ddcd4ed0b479db847d146c3ff4d24816c9837fbe3&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

+ 채팅방의 대화 내용을 DB에 저장하고, 주기적으로(주 1회) 유저들의 점수에 반영한다.
+ 이 때, 채팅 내용은 학습이 된 모델을 통해 유저의 대화 패턴 긍정도와 부정도를 파악한다. 언행 점수는 DB에 저장되고, 추후 점수가 비슷한 사용자들끼리 매칭 서비스에 이용될 것이다.

### 설치 및 실행

```
python --version # 3 이상
pip install jupyter
jupyter notebook #jupyter 속에서 NLP/NLP.ipynb 파일 실행
```

필요 라이브러리

|Library|Desc|
|--|--|
|jupyter notebook| jupyter notebook 뷰어 및 편집기 (jupyter-lab 도 가능)|
|konlpy|한국어 정보처리를 위한 파이썬 패키지. Okt를 사용하여 형태소를 분석한국어 정보처리|
|nltk|데이터 전처리 과정을 위한 라이브러리|
|tensorflow|머신러닝 오픈소스|
|matplotlib|시각화 도구|
|numpy|수학 연산(배열, 통계, 행렬)을 위한 패키지|


## 4. 기능 B. 동물상 기반 추천 기능(필수)
### Check List
- [ ] 테스트 계정으로 로그인을 할 수 있다.
- [ ] 프로필 사진을 등록할 수 있다.
- [ ] 프로필 사진 등록 후 동물상 뱃지가 노출된다.

### 이렇게 재미있게 했어요!
- 팀원 프로필사진 동물상 분류
- 마스터님 / 운영진님 사진 동물상 분류

### 회고 및 소감
회고 및 소감..


### 참여자
#### Back-end
조준형 신준수 김하균 이기훈 이승표 이소연 이상준  

#### Front-end
정수원 김병국 황석영 김혜지  


## 5. 기능 C. 회원 정보 기반 이성 추천 기능(필수)



## Contributing
네이버 커넥트재단 부스트캠프에 참여하신 모든 분들의 참여 기다립니다.



## License
[MIT](https://choosealicense.com/licenses/mit/)
