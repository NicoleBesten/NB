// this is the js file
Recipes = new Mongo.Collection("recipes");

if (Meteor.isClient) {

  Session.set("recipesLimit", 8);

  lastScrollTop = 0; 
  $(window).scroll(function(event){
    // test if we are near the bottom of the window
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      // where are we in the page? 
      var scrollTop = $(this).scrollTop();
      // test if we are going down
      if (scrollTop > lastScrollTop){
        // yes we are heading down...
       Session.set("recipesLimit", Session.get("recipesLimit") + 4);
      }

      lastScrollTop = scrollTop;
    }
        
  })

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });




   Template.recipes.helpers({
    recipes:function(){
      if (Session.get("userFilter")){// they set a filter!
        return Recipes.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}});         
      }
      else {
        return Recipes.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("recipesLimit")});         
      }
    },
    filtering_recipes:function(){
      if (Session.get("userFilter")){// they set a filter!
        return true;
      } 
      else {
        return false;
      }
    },
    getFilterUser:function(){
      if (Session.get("userFilter")){// they set a filter!
        var user = Meteor.users.findOne(
          {_id:Session.get("userFilter")});
        return user.username;
      } 
      else {
        return false;
      }
    },
    getUser:function(user_id){
      var user = Meteor.users.findOne({_id:user_id});
      if (user){
        return user.username;
      }
      else {
        return "ano";
      }
    }
  });

  Template.body.helpers({username:function(){
    if (Meteor.user()){
      return Meteor.user().username;
        //return Meteor.user().emails[0].address;
    }
    else {
      return "anonymous internet user";
    }
  }
  });

   Template.recipes.events({
    'click .js-recipe':function(event){
      $(event.target).css("width", "200px");
    }, 
    'click .js-del-recipe':function(event){
      //var image_id = $(this).data('id'); 
       var image_id = this._id;
       console.log(image_id);
       // use jquery to hide the image component
       // then remove it at the end of the animation
       $("#"+image_id).hide('slow', function(){
        Recipes.remove({"_id":image_id});
       })  
    }, 
     'click .js-meer-recipe':function(event){
      $("#recipe_full").modal('show'); 
    },
    'click .js-rate-image':function(event){
      var rating = $(event.currentTarget).data("userrating");
      //console.log(rating);
      var image_id = this.data_id;
      console.log("Image: "+image_id+" rating now: "+rating);

      Recipes.update({_id:image_id}, 
                    {$set: {rating:rating}});
    }, 
    'click .js-show-recipe-form':function(event){
      $("#recipe_add_form").modal('show');
    }, 
    'click .js-set-recipe-filter':function(event){
        Session.set("userFilter", this.createdBy);
    }, 
    'click .js-unset-recipe-filter':function(event){
        Session.set("userFilter", undefined);
    }, 
   });



  Template.recipe_add_form.events({
    'submit .js-add-recipe':function(event){
      var img_src, img_alt, recipe_name;

        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;
        recipe_name = event.target.recipe_name.value;
        console.log("src: "+img_src+" alt:"+img_alt);
        if (Meteor.user()){
          Recipes.insert({
            img_src:img_src, 
            img_alt:img_alt,
            recipe_name:recipe_name,
            createdOn:new Date(),
            createdBy:Meteor.user()._id
          });
      }
        $("#recipe_add_form").modal('hide');
     return false;
    }
  });


}

