import google_images_download

response = google_images_download.googleimagesdownload()

args_male = {
  "keywords":"남자",
  "suffix_keywords":"호랑이상,곰상,공룡상,강아지상,메기상,돼지상",
  "limit" :50,
  "print_urls":True
}

args_female = {
  "keywords":"여자",
  "suffix_keywords":"토끼상,여우상,강아지상,고양이상,금붕어상,다람쥐상",
  "limit" :50,
  "print_urls":True
}

paths = response.download(args_male)
print(paths)

paths = response.download(args_female)
print(paths)

