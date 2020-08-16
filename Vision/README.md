# Relay 2 - B : 프로필 사진 동물상 분석

담당 팀원: J150 이승표, J105 신준수

## dataset

### Google Images 크롤링
- dependency 설치
~~~
pip install -r requirements.txt
~~~
- 프로그램 사용
~~~
python crawler.py
python3 crawler.py // if using python3 keyword
~~~
  - 현재 디렉토리의 downloads 폴더에 성별/동물상 별 이미지 50개씩 다운로드
  - 사용한 Python Package: https://github.com/hardikvasa/google-images-download

## Teachable Machine 모델 학습
![남자 동물상](https://user-images.githubusercontent.com/32660326/90334286-90fb4280-e007-11ea-88de-2b0cfff20b4d.png)
남자 동물상 모델([테스트 URL](https://teachablemachine.withgoogle.com/models/KKFX8PVPV/))

![여자 동물상](https://user-images.githubusercontent.com/32660326/90334288-935d9c80-e007-11ea-914a-4603033504e8.png)
여자 동물상 모델([테스트 URL](https://teachablemachine.withgoogle.com/models/WDy6sw0EE/))

## Teachable Machine 모델 사용
- animal-type.js 파일에 정의된 predictImage 함수를 import 하여 사용
- Input:
  - inputImage: HTMLImageElement
  - gender: "man" or "woman"
- Output:
  - Classification 된 동물상
