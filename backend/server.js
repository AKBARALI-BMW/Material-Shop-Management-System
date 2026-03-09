const express = require('express');

const app = express();
const port = 4000;
app.use(express.json());

app.get("/", function(req, res){
    res.send("server is run ");
})

app.listen(port, function(){
    console.log(`server is run on port ${port}`);
}    
);
