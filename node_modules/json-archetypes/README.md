![json archetypes data standards](https://github.com/servant-cmes/json-archetypes/blob/master/json_archetypes_banner.png)

#JSON Archetypes

###Open-Source JSON Standards For Popular Types Of Data.

Because most apps make the same kinds of data over and over again.

***STATUS: This is currently a work in progress.  We are waiting to receive feedback from more people before launching JSON Archetypes Version 1***

Consistent data objects allow Developers to easily build applications that know how to handle them, and allow users to use the same set of data across multiple applications.  

Each JSON Archetype uses the [JSON Schema](http://json-schema.org "http://json-schema.org") format to describe the Archetype and its validation rules.  All of the Archetypes can be found in the `archetypes` folder.  JSON Archetypes are meant to be lean and contain only the essential properties/attributes that define and differentiate each archetype.  The challenge is to agree on what those properties/attributes are...

These were created to work with [Servant](https://www.servant.co "http://servant.co"), which allows people to host their own data (in these formats), instead of the applications they use hosting it. 

**This Repo contains the following:**

 - JSON Schemas for each JSON Archetype
 - Tests to check if the JSON Archetype Schemas are valid per the JSON SCHEMA DRAFT 4 specs

*This repo is only for defining schemas  If you're looking for helper methods to quickly instantiate valid Data Archetypes and work with them in your applications, check out the Servant SDKs.*
 
**Feel free to contribute to the existing JSON Archetypes or create your own!**


##Contributing
Anyone who has a JSON Archetype in mind, or wants to add to existing JSON Archetypes is free to contribute.  Just follow these steps:

 - Fork this project.
 - Clone your forked project (which should now be in your github account) to your computer.
 - Create a branch and work on it to create/modify existing JSON Archetypes
 - Try to submit pull requests for one Archetype at a time

More on how to contribute to a Github project [here](https://guides.github.com/activities/contributing-to-open-source/).

##Architecture Principles

 - **Shallow Architecture -**  Don't add nested objects.  Only Arrays are allowed, and if they contain objects, keep those objects small.  Shallow architecture makes the Archetypes more accessible using simpler queries that can be effectively indexed to scale well.
 - **Unique Property Names -** Every property name in an Archetype must be unique.
 - **Follow The JSON Schema Specs -** http://json-schema.org/example1.html 
 - **Copy Schema.org Schemas wherever you can -** http://schema.org 


##F.A.Q.
###How is this different from Schema.org?
JSON Archetypes are more limited versions of the schemas on schema.org.  While application developers can comprehend [the verbose, nested data architecture Schema.org uses](http://schema.org/docs/full.html "http://schema.org/docs/full.html"), common people can’t, and they shouldn't have to.  [Servant’s](https://www.servant.co) goal is to make it easier for anyone to create, manage and retain control of their data.  We arrived at these simpler schemas to support that goal.  

That said, we’ve tried to copy schema.org schemas, as well as their property names, so there will be interoperability.  Hopefully we can evolve to further resemble schema.org in the future, but right now, our priority is to keep the data simple, and not just so regular people can comprehend and manage it themselves, but because it's more fun and easy for developers to build apps with.

###Can I add additional properties to the Archetypes?
Yes, but do it in your own application.  99% of the time, developers want to put properties on the Archetypes that are only relevant to the applications they want to make.  Nothing wrong with that.  Most people make **meta** objects for each Archetype and save them in their application’s own database.  There are infinite use-cases for the Archetypes, and if we attached properties for each we’d have infinite bloat. 

Otherwise, if you think the property is absolutely necessary, contribute to this repo :)

###As a User, how can I store extra data in each Archetype (e.g. obscure product details)?
Archetypes aren't going to be perfect for everyone.  But don't let the perfect be the enemy of good.  

Occasionally, you may not be able to find room to squeeze in obscure details.  On the other hand, JSON Archetypes radically increase distribution and productivity of your data.  Yes, you may miss a small detail, but more importantly, you will be able to show and use your data EVERYWHERE.

###Bro, I found [this comic on XKCD](http://xkcd.com/927/) and it’s totally relevant.  Can I show it to you?
No.
