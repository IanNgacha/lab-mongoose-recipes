const mongoose = require('mongoose');
const Recipe = require('./models/Recipe.model');
const recipes = require('./data.json');

// Connection to the database
mongoose.connect('mongodb://localhost:27017/recipe-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');

    // Insert multiple recipes from data.json
    return Recipe.insertMany(recipes);
  })
  .then(insertedRecipes => {
    // Log the title of each inserted recipe
    insertedRecipes.forEach(recipe => {
      console.log('Recipe created:', recipe.title);
    });

    // Update the duration of "Rigatoni alla Genovese"
    return Recipe.findOneAndUpdate(
      { title: 'Rigatoni alla Genovese' },  
      { duration: 100 },                   
      { new: true }                        
    );
  })
  .then(updatedRecipe => {
    if (updatedRecipe) {
      console.log(`Success! The duration of "${updatedRecipe.title}" has been updated to ${updatedRecipe.duration} minutes.`);
    } else {
      console.log('Recipe not found.');
    }

    // Delete the "Carrot Cake" recipe
    return Recipe.deleteOne({ title: 'Carrot Cake' });
  })
  .then(deletionInfo => {
    if (deletionInfo.deletedCount > 0) {
      console.log('Success! The "Carrot Cake" recipe has been removed from the database.');
    } else {
      console.log('The "Carrot Cake" recipe was not found in the database.');
    }

    // Disconnect from the database after all operations
    return mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error during database operations:', error);
  });
