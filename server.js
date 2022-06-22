//import puppeteer 
const puppeteer = require('puppeteer');
const express = require('express');

//only for current deploy, isnt stored in a file.
let visitorCounter = 0
let usesCounter = 0

//launch browser
console.log('APP BY ZAYD');
const app = express();
const port = process.env.PORT;
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
console.log(    (__dirname+'/views'))
app.set('port', process.env.PORT);

//make index page express
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    visitorCounter++;
    console.log('visits on current runtime : '+visitorCounter);
    console.log('uses on current runtime : '+usesCounter);
 
});

app.get('/result/:url',(req,res)=>{
    usesCounter++;
    let imgs;
    let userURL=req.params.url;
    console.log(userURL);   
    if(userURL.includes('@')){
        let userURLtemp=userURL.split('LvideoL')[0];
        userURL=" https://www.tiktok.com/"+userURLtemp+'/video/'+userURL.split('LvideoL')[1];
        console.log(userURL);
    } else{
        userURL = 'https://www.tiktok.com/t/'+userURL
    }
    async function getImages(){
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox']
        });
        console.log("browser launched");
        const page = await browser.newPage();
        page.setUserAgent(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        );
        await page.goto(userURL);
        imgs = await page.$$eval('.swiper-slide img[src]', imgs => imgs.map(img => img.getAttribute('src')));
        let temp = imgs;
        let indices = [];
        if(imgs.length==0){
            res.send('<h1>No images found</h1> <a href="/">Go back</a>');
            return 'no images found';
        }
        await browser.close();
        for (let i = 0; i < imgs.length; i++) {
            temp[i].split('-tx/')[1].split('~tplv')[0];
            if(indices[temp[i]]){
                imgs.splice(i,1);
            } else{
                indices[temp[i]] = 1;
            }
        }
        imgs.splice(imgs.length-1,1);    
        imgs[imgs.length]=imgs[0];
        imgs.splice(0,1);
        return imgs  
    }
    getImages().then((result)=>{
        if(result!='no images found'){
            res.render("result",{images:imgs});
        }
    });
    //res.render('result'); 

});

//make express server

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
