# her-health

## Inspiration
We believe that women* are one of the leading contributors to the constantly growing technology industry. However, it is no surprise that we face a lot of challenges while working in such a male-dominated field. In our team, we believe that staying healthy is one of the greatest challenges that women* face today. With that being said, our inspiration behind our project is to give women* an all encompassing resource to readily access information regarding illnesses and to seek advice from a health care professional in the nearby facility, if they desire to do so.

## What it does
Our web application is designed to query an illness and get back a list of corresponding symptoms and causes from our database, along with a map with markers indicating the nearby doctors. A list of relevant doctor information is displayed below the map for the user's convenience and clicking on the markers will display the doctor's contact information, should the user want to reach out to a health care professional.

## How we built it
We use webscraping to gather the relevant information about the illnesses and place the information into a SQL database, specifically cockroachDB. The same idea is used to gather and store the doctors' information. Through the cockroachDB database, we are able to quickly extract the related illness information based off of using the query in the search engine provided by the user as a keyword.  Additionally, by iterating through the list of relevant doctors, we use a maximum distance threshold to decide if the doctor is close enough to the user and if they are, then a marker will be placed onto the map, with the doctor's information displayed underneath.

## Challenges we ran into
Some challenges we ran into were learning how to work with a new API as well as a new SQL database, especially under such a short deadline. Moreover, the more we discussed what our web application should do, the bigger the project got, until we realized that we could not implement all the ideas we wanted within the timeframe given. So the difficult part was trying to narrow down one main task that we wanted our web application to perform and still be able to realistically implement it properly within the 24 hour time period given.  

## Accomplishments that we're proud of
We are proud of how far we have come with implementing and displaying how our web application looks. The homepage of the web application looks almost the same as what we had designed during our planning and while the implementation may not be completely bug-free, it displays  most of the functionality that we wish to show through this hackathon. For example, we are able to get the proper information regarding the illnesses, store it into our SQL database and display the information on the webpage. Despite not being able to render the map on the same page as the illness information, the map does render onto the webpage with almost all the intended functionality being displayed. Moreover, our prototype, shown using Figma, looks pretty cool (if we do say so ourselves).

## What we learned
We learned that planning ahead is an important part of how well the project will be implemented in such a short time and that having an open communication also plays a big part in how much we can accomplish. With our team, we sat through planning exactly how we wanted our prototype to look and what functionality we are able to realistically implement for our web application. We believe that the additional time given to planning was what ultimately helped us to accomplish such a good looking prototype and being able to implement as much as we did.

## What's next for herHealth*
The main goal for herHealth* in this hackathon was to be able to output the symptoms and causes of the queried illness, along with a map that shows doctors and their contact information the user can consult. We plan to expand the search engine to also include a list of symptoms with checkboxes that the user can mark off and be returned with a list of possible illnesses that they could have.  We are also hoping to integrate a page in our web application where it allows the user to set up an appointment with the nearby doctors, as it enhances the overall goal of providing women* with accessible healthcare advice.
