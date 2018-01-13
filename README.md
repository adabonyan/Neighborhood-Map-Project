# Neighborhood Map
This project employs Knockout js  to develop a one page App to make api call to FourSquare API and use Google Map services to display a Map showing user's:
- Central location
- Places of interest 

## On load
- Map will be displayed with markers. Each marker has own specific color and it's position indicates the place of interest. The home menu page is hidden.

- Click on any marker to get place detail as available on FourSquare. 
- Note that the information available in FourSquare is not as comprehensive as google place (photo, panorama, etc. can only be obtained by special request. see `console.log(data.response.venue)`)
- User can zoom the map using the zoom slider on botton right of the map

- A click on the Menu button will display the home page which has:
 a. Places of interest as a drop down selection list.
 b. An input field to search for places in the list

### Input search field
- User can search for a place of interest by entering the name of a place. Normally the first 2 letters will be sufficient for a search.

- A map will be displayed showing only two markers, the user central place and the place of interest that is searched for. Place marker will be displayed, bounce for 3 secs and it's infowindow will be displayed.

### Select (list) field
- Click on a place The following will occur:
 a. Map will be displayed.
 b. Place marker will be displayed.
 c. The selected place marker will bounce for 3 secs, it's infowindow will open to display the place details.
 d. To close the infowindow, user can either click on the infowindow x (close) button on top right hand side OR click anywhere inside the map.

## User Notes 
- You can download this App to your device and run on `localhost` (a local server on your device). To do this follow these instructions (reference also to `github` and your `localhost`):
- On your device, create a folder to hold the app files.
- Go to [Link](https://github.com/adabonyan/Neighborhood-Map-Project)
- Click `Clone in Desktop` or `Download ZIP` (green button about the middle of the page on the right hand side)
- On your device, open the folder to view files. 
- On your browser, open `localhost` and type in the index.html path (or follow guide on how to use your `localhost`)
- Open `index.html` in your browser.

- This site is also published at `github` [Link](https://adabonyan.github.io/Neighborhood-Map-Project/) 

## Future work
- Host this App on a certified server (not github, localhost) and check FourSquare responses to venues details and photo api calls.
- Allow user to make own request for places of interest
- The new yelp Fusion API call is presently a challenge. There is no example of this yet. yelp does not accept neither localhost nor github for hosting. There should solution somewhere.
