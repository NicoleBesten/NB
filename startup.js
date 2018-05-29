if (Meteor.isServer){
  Meteor.startup(function(){
	if (Recipes.find().count() == 0){
		for (var i=1;i<10;i++){
			Recipes.insert(
				{
					img_src:"img_"+i+".jpg",
					img_alt:"image number "+i, 
					recipe_name:"recipe_name"+i
				}
			);	
		}// end of for insert images
		// count the images!
		console.log("startup.js says: "+Recipes.find().count());
	}// end of if have no images
  });
}