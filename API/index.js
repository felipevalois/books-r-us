const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const Cors = require('cors');
var app = Express();


Mongoose.connect("mongodb://localhost:27017/books", {useNewUrlParser: true});

app.use(Cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.options('*', Cors());


const SetsModel = Mongoose.model("sets", {
   department: String,
   courseNumber: String,
   className: String,
   professor: String,
   sectionId: String,
   isbn: String,
   status: {$type:String,required:false},
   price: {$type:[String],required:false},
   condition: {$type:[String],required:false}
});

const FavoritesModel = Mongoose.model("favorites", {
   uid: String,
   itemId: String
});


//READ
app.get("/departments", async (request, response) => {
   try{
      var result = await SetsModel.distinct("department").exec();
      response.send(result);
   } catch (error){
        response.status(500).send(error);
   	console.dir(error);
   }
});

app.get("/department/:department", async (request, response) => {
    try{
       var department = await SetsModel.distinct("courseNumber",{department: request.params.department}).exec();
       response.send(department);
    } catch (error){
       response.status(500).send(error);
    }
 });

app.get("/sections/:department/:courseNumber", async (request, response) => {
   try{
      var result = await SetsModel.distinct("section",{department: request.params.department, courseNumber: request.params.courseNumber}).exec();
      response.send(result);
   } catch (error){
      response.status(500).send(error);
   }
});

app.get("/books/:department/:courseNumber/:section", async (request, response) => {
	try{
		var result = await SetsModel.find({department: request.params.department, courseNumber: request.params.courseNumber, section: request.params.section}).exec();
      response.send(result);
   } catch (error){
      response.status(500).send(error);
   }
});

app.get("/favorites/:uid", async (request, response) => {
   try{
      var result = await FavoritesModel.distinct("itemId",{uid: request.params.uid}).exec();
      response.send(result);
   } catch(err){
      response.status(500).send(err);
   }
});		

app.post("/favorite", async (request, response) => {
	try{
		var favorites = new FavoritesModel(request.body);
		var result = await favorites.save();
		response.send(result);
	} catch (err) {
		response.status(500).send(err);
	}
});

app.delete("/favorite/:uid/:itemId", async (request, response) => {
	try{
		var result = await FavoritesModel.deleteOne({uid: request.params.uid, itemId: request.params.itemId}).exec();
		response.send(result);
	} catch (err) {
		response.status(500).send(err);
	}
});


app.listen(8001, () => {
   console.log("Listening at :8001...");
});

