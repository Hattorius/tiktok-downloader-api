import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

const app = express();

function unicodeToChar(text: string) {
    return text.replace(/\\u[\dA-F]{4}/gi, 
            function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
}

const getWithLink = async(link: string, req: Request, res: Response) => {
    const response = await fetch(link, {
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
        }
    });
    const body = await response.text();
    const url = unicodeToChar(body.split('"loading":false,"statusCode":0,"hasMore":true,"cursor":"0","preloadList":[{"url":"')[1].split('"')[0]);

    res.json({
        video: url
    });
}

app.get("/:link", async (req, res) => {
    await getWithLink("https://vm.tiktok.com/" + req.params.link, req, res);
});

app.get("/https\:\/\/vm.tiktok.com\/:link", async (req, res) => {
    await getWithLink("https://vm.tiktok.com/" + req.params.link, req, res);
});

app.listen(8080, () => {
    console.log("App online!")
})