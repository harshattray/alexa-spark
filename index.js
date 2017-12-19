/**
 * @Author: Harsha Attray <harsha>
 * @Date:   2017-12-19T17:36:13+05:30
 * @Filename: index.js
 * @Last modified by:   harsha
 * @Last modified time: 2017-12-19T17:37:21+05:30
 * @License: Apache License v2.0
 */

 var Alexa = require('alexa-sdk');

 var FactDataObject = {
     JAPAN:[
         "Japan consists of over 6,800 islands",
         "The Japanese have such a low birth rate that there are more adult diapers sold than baby diapers.",
         "Shinjuku station, Tokyo’s main train station, is the busiest in the world with over 2 million people passing through it every day.",
         "Ninety percent of all mobile phones sold in Japan are waterproof because youth like to use them even while showering.",
         "The sole Japanese man who survived the wreck of the RMS Titanic in 1914, Masabumi Hosono, was called a coward in his country for not dying with the other passengers",
         "In Japan, it is considered rude to tear the wrapping paper off of a gift.",
         "The Japanese have more pets than children."
         ],
     INDIA:[
         "India is about 1/3 the size of the United States, yet it is the second most populous country in the world, with a population of 1,166,079,217",
         "The earliest cotton in the world was spun and woven in India. Roman emperors would wear delicate cotton from India that they would call “woven winds.” Mogul emperors called the fabrics “morning dew” and “cloth of running water.",
         "India has the world’s third largest road network at 1.9 million miles. It also has the world’s second largest rail network, which is the world’s largest civilian employer with 16 million workers.",
         "London has more Indian restaurants than Mumbai or Delhi. Britain also has the largest Indian restaurant in the world, The Aakash, which can seat up to 750 people in one sitting.",
         "The Golden Temple in India feeds a vegetarian meal to over 100,000 people a day regardless of race, religion and class.",
         "The Baily Bridge is the highest bridge in the world. It is located in the Ladakh valley between the Dras and Suru rivers in the Himalayan mountains. It was built by the Indian Army in August 1982",
         "India is the largest English speaking nation in the world.",
         "India has the world’s third largest road network at 1.9 million miles. It also has the world’s second largest rail network, which is the world’s largest civilian employer with 16 million workers."
         ]
 };

 function getFactFunction(country){
     var country = (country === undefined)?undefined:country.toLocaleLowerCase();
     console.log('IN the function');
     // get random country if country is not defined
     if(country === undefined){
         var totalCountrySets = Object.keys(FactDataObject).length;
         var randomGen = Math.floor(Math.random() * totalCountrySets )
             country = Object.keys(FactDataObject)[randomGen];
     }

     //check if country exists and has a single name
     switch(country){
         case 'japan':
             country = 'JAPAN';
             break;
         case 'india':
             country = 'INDIA';
             break;
         default:
         country = "Unknown";
     }
     //if country is Unknown , return false
     if(country === 'Unknown'){
         console.log('I still have to learn a lot about this country, Also my developer is too lazy');
         return false;
     }
     //Get total facts from factDataObject

     var totalFacts = FactDataObject[country].length;
     var randomFacts = Math.floor(Math.random() * totalFacts);
     var fact = FactDataObject[country][randomFacts]
     console.log("random facts returned");

     return [country,fact];
 }

 var handlers = {
     // When launched without any actions like ask Spark or open Spark
     'LaunchRequest': function(){
         console.log('LaunchRequest handler started');
         // Introduction handler

         this.emit('Introduction');
     },

     Introduction: function(){
       console.log("Introduction handler called");
       //User opened skill without any input
       var speechOutput = "Hello, Spark is at your Service!! Ask me abt India and Japan. My developer was too lazy to add anything else";
       //Incase user didnit provide any input
       var replyPrompt = "I didnot recieve any input, Spark signing out!!";

       // Speech through alexa device;
       this.emit(':ask',speechOutput,replyPrompt);
     },
     //defined Intents within the skill are listed here;

     //Intent when user asks for a random Fact

     "RandomTrivia": function(){
         console.log("RandomTrivia handler called");
         // call the getFactFunction() to get the array of country and trivia
         var getTrivia = getFactFunction();
         var country = getTrivia[0];
         var trivia = getTrivia[1];

         // Card title and card Content is  for alexa
         var cardTitle = "Fun Fact from " + getTrivia[0];
         var cardContent = trivia;
         var speechOutput = "Fun Fact from " + country + " "+"Coming up!" + trivia;

         // Speech with card input

         this.emit(':tellWithCard',speechOutput,cardTitle,cardContent);
     },

     //Intent for when a user asks for a specific country

     "SparkTrivia": function(){
         var country = this.event.request.intent.slots.country.value;
         var getTrivia = getFactFunction(country);
         //if getFactFunction() wasnt able to detect the country send it to Unhandled Intent
         if(!getTrivia){
             this.emit('Unhandled');
         }

         // override the country name with the one we get from the getFactFunction()
         country = getTrivia[0];
        var  trivia = getTrivia[1];

           // Card title and card Content is  for alexa
         var cardTitle = "Fun Fact from " + country;
         var cardContent = trivia;
         var speechOutput = "Fun Fact from " + country + " "+"Coming up!" + trivia;

         // Speech with card input
         this.emit(':tellWithCard',speechOutput,cardTitle,cardContent)

     },
       //Intent - Unhandled
     'Unhandled': function (){
         console.log('entered unhandled intent');
         this.emit(':tell',"Sorry I do not understand that! You can try again or blame my developer for making me so dumb!")
     }
 }


 exports.handler = function(event,context, callback){
     //alexa object via alexa sdk

     var alexa = Alexa.handler(event,context,callback);
     //register and execute all the handlers and intents
     alexa.registerHandlers(handlers);
     alexa.execute();
 };
