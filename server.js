'use strict';

var config = {
    env: "production",
    host: "localhost",
    port: 3000,
    charset: "utf8",
    restURL: "http://example.com/"
};

const author = {
    name: "Jamiu Mojolagbe",
    email: "mojolagbe@gmail.com",
    phone: "2048697315",
    GoogleAPIKey: "AIzaSyDQ27WgInDdmdUlbeM_-CsTmfY_Jx0LCyg",
    DarkSkyAPIKey: "752ca7ee5d3924bfb68660d1ad417709"
};

const Hapi = require('hapi');   
const server = new Hapi.Server();
const req = require('request');
const Joi = require('joi');

var connecParams = (config.env === 'production')  ?   { port: process.env.PORT }
                : {port: config.port, host:config.host};

server.connection(connecParams);

const start = async () => {
    server.register(
        [  
            {
              register: require('vision')  // add template rendering engine
            },
            {
              register: require('inert')  // handler for static files/directories
            }
        ], 
        function(error) {
            if (error) { throw error; }

            // views configuration
            server.views({  
                engines: {
                    html: require('handlebars')
                },
                relativeTo: __dirname,
                path: 'views',
                layoutPath: 'views/layout',
                layout: 'default',
                //helpersPath: 'views/helpers',
                partialsPath: 'views/partials'
            });
        }
    );
};
start();


// --------------
// Load Routes
// --------------

// home page
server.route({
    method: 'GET',
    path: '/',
    handler: function(request, response) {
        response.view('index');
//        req(config.restURL+'pets/', function (err, resp, cont) {
//            if (!err && resp.statusCode === 200) {
//                response.view('index', {status: resp.statusCode, data: JSON.parse(cont)});
//            } else {
//                throw err;
//                console.log(err);
//                response.view('index', {status: resp.statusCode, data: JSON.parse(err)});
//            }
//        });
    }
});

// author's page
server.route({
    method: 'GET',
    path: '/author',
    handler: function(request, response) {
        var data = {
            name: author.name,
            phone: author.phone,
            email: author.email
        };
        response.view('author', data);
    }
});

// add pet page
server.route({
    method: 'GET',
    path: '/add',
    handler: function(request, response) {
        response.view('pet', {status: 1, actionURL: config.restURL+'pets/'});
    }
});

// pet's details page
server.route({
    method: 'GET',
    path: '/{id}',
    handler: function(request, response) {
        //response.view('pets', {status: 0, data: 1});
        if(request.params.id > 0) {
            req(config.restURL+'pets/'+request.params.id+'/', function (err, resp, cont) {
                if (!err && resp.statusCode === 200) {
                    //console.log({status: resp.statusCode, data: JSON.parse(cont)});
                    response.view('pets', {status: resp.statusCode, data: JSON.parse(cont)});
                } else {
                    throw err;
                    console.log(err);
                    response.view('pets', {status: resp.statusCode, data: err});
                }
            });
        }
    },
    config: {
        validate: {
            params: {
                id: Joi.number().integer().min(1)
            }
        }
    }
});




// --------------------
// Static file routes
// ---------------------
    
server.route({
    method: 'GET',
    path: '/public/css/{style*}',
    handler: (request, reply) => {
        reply.file(`public/css/${request.params.style}`);
    }
});

server.route({
    method: 'GET',
    path: '/public/images/{imgfile*}',
    handler: (request, reply) => {
        reply.file(`public/images/${request.params.imgfile}`);
    }
});

server.route({
    method: 'GET',
    path: '/public/scripts/{scriptfile*}',
    handler: (request, reply) => {
        reply.file(`public/scripts/${request.params.scriptfile}`);
    }
});




// ------------------
// Start The Server
// ------------------
server.start(error => {  
    if (error) {
        console.error(error);
    }
    console.log(`Server started at ${server.info.uri }`);
});