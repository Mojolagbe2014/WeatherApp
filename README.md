Pet Weather App
==============

This is Pet Weather App. It is an application that answers the question `Does my pet need an umbrella?`. 

It combines the [Dark Sky API](https://darksky.net/dev/account) with [Pet Shelter API](https://github.com/Mojolagbe2014/ShelterAPI.git) to determine the appropriate answer to the question.

It features automatic latitude, longitude, current city and province detection if the app is granted permission to access the device location.

The app is fully responsive and as such can be viewed nicely on mobile devices.



System Requirements
-------------------

Install the following softwares on your machine:

 * [npm via Node.js](https://www.npmjs.com/get-npm)

 * [Git](https://git-scm.com/downloads) (optional)


App Installation on a Local Machine
-----------------------------------

  * [Clone the Pet Weather App repository](https://github.com/Mojolagbe2014/petweatherapp.git) 
  
    This can be done via the terminal/command window with 
    ```bash
    $ git clone https://github.com/Mojolagbe2014/petweatherapp.git
    ```
    In order to use command `git`, [Git](https://git-scm.com/downloads) must first be installed on your machine.
    
  * Navigate to the cloned directory, then run the command 
    ```bash 
    $ npm install 
    ```
    to install the App's dependencies. [More details on this command..](https://docs.npmjs.com/cli/install) After several   installation steps, directory `node_modules` is created in the cloned directory.
  
  * In order to change the configuration parameters, the configuration file `config.js` is used for this purpose and it contains default values that can be changed. 

  * Change the `env` variable in the `config.js` to `development`.
  
  * Having gone through the above steps successfully, then run the command
    ```bash 
    $ npm start 
    ``` 
    to start the server.
  
  * Once the server has started running, the App can be viewed by visiting `http://localhost:[insert_the_port]/`. The default port in the `config.js` file is `3000`, so if the port is left intact you can visit `http://localhost:3000/`

Usage
-----

Here is how you use it:

  * http://localhost:[insert_the_port]/           - It is the home page and contains the list of all the registered pets.
  
  * http://localhost:[insert_the_port]/pets/id/   - Shows the answer for the pet with `ID = id`. Simply clicking on the :eye: symbol infront of a specific pet on the home page will navigate to this page.
  
  * http://localhost:[insert_the_port]/pet/add/   - It is the page for adding a new pet. By clicking on the :heavy_plus_sign: symbol on the home page you get to this page. It auto detects the user's latitude, longitude, and location. However, the user can also change the latitude and longitude values but not the location. The location is on automatic detection.

#### For online based server replace the `http://localhost:[insert_the_port]/` with the appropriate address.



# petweatherapp
# WeatherApp
