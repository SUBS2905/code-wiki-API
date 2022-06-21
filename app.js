const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

/*              Requests targetting all the articles                */

//chaining the get,post,delete methods of /articles route
app.route("/articles")

    //fetch all the artcles from the API
    .get((req,res)=>{

        Article.find({},(err,foundArticles)=>{
            if(!err)
                res.send(foundArticles);
            else
                res.send(err);
        });

    })      //no semicolon

    //post an article to the API
    .post((req,res)=>{

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err)=>{
            if(!err)
                res.send("Successfully added the new article!");
            else
                res.send("Something went wrong :(");
        });
    })      //no semicolon

    //delete ALL the articles from the API
    .delete((req,res)=>{
        Article.deleteMany({}, (err)=>{
            if(!err)
                res.send("Deleted all articles successfully!")
            else
                res.send(err);
        });
    });

/*              Requests targetting a specific article                */

app.route("/articles/:articleTitle")

    .get((req,res)=>{
        Article.findOne({title: req.params.articleTitle},(err,foundArticle)=>{
            if(!err)
                res.send(foundArticle);
            else
                res.send("No article with the requested title exists!");
        });
    })

    .put((req,res)=>{
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {runValidators: true},  //runValidators == overwrite
            function(err){
                if(!err)
                    res.send("Successfully updated the article!");
                else
                    res.send(err);
            });
    })

    .patch((req,res)=>{
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err)
                    res.send("Successfully updated the article!");
                else
                    res.send(err);
            }
        );
    })

    .delete((req,res)=>{
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err)=>{
                if(!err)
                    res.send("Successfully deleted the article!");
                else
                    res.send(err);
            }
        );
    });

let port = process.env.PORT;
if (port == null || port == "")
    port = 3000;
app.listen(port, ()=>{
    console.log("Server started...");
});