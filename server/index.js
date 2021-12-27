const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const https = require('https');

const XLSX = require('xlsx');

var booksData;

let url = "https://api.nytimes.com/svc/books/v3/lists/hardcover-fiction.json?api-key=Ybs3TXGHxmxbMTiaXxjoXBnKBtLtet3r";

https.get(url, (res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            booksData = json["results"]["books"]; // list of all books from the books api of nytimes.com
            const ws = XLSX.utils.json_to_sheet(booksData)  // converts json into sheet format
            const wb = XLSX.utils.book_new() // creates a new excel sheet
            XLSX.utils.book_append_sheet(wb, ws, 'Responses') // name sheet name as Responses
            XLSX.writeFile(wb, 'book.xlsx') // writes books data into excel sheet and save it as book.xlsx
        } catch (error) {
            console.error(error.message);
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});

// api end point to search for the book and return in json format
app.get('/api/bookSearch/:title', function (req, res) {
    const title = req.params.title;
    let searchBook = booksData.find(book => book.title === title);
    res.json({ searchBook });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});