package main

import (
	"io"
	"net/http"
	"os"
	"path"
)

func main() {
	DownloadFile("https://01.alem.school/git/root/public/raw/branch/master/subjects/tron/game_students/index.html")
	DownloadFile("https://01.alem.school/git/root/public/raw/branch/master/subjects/tron/ai/hard.js")
	DownloadFile("https://01.alem.school/git/root/public/raw/branch/master/subjects/tron/ai/license-to-kill.js")
	DownloadFile("https://01.alem.school/git/root/public/raw/branch/master/subjects/tron/ai/random.js")
	DownloadFile("https://01.alem.school/git/root/public/raw/branch/master/subjects/tron/ai/right.js")
	DownloadFile("https://01.alem.school/git/root/public/raw/branch/master/subjects/tron/ai/snail.js")
}

func DownloadFile(url string) error {
	res, err := http.Get(url)
	if err != nil {
		return err
	}
	data, err := io.ReadAll(res.Body)
	if err != nil {
		return err
	}
	file, err := os.Create(path.Base(url))
	if err != nil {
		return err
	}
	_, err = file.Write(data)
	return err
}
