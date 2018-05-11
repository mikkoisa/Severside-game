define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./public/images/apidoc/main.js",
    "group": "C__Users_Mikko_Desktop_Server_side_scripting_assignments_projo_public_images_apidoc_main_js",
    "groupTitle": "C__Users_Mikko_Desktop_Server_side_scripting_assignments_projo_public_images_apidoc_main_js",
    "name": ""
  },
  {
    "type": "get",
    "url": "scores/:game",
    "title": "Request scoreboard",
    "name": "GetScores",
    "group": "Scores",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game",
            "description": "<p>Name of game</p>"
          }
        ]
      }
    },
    "description": "<p>Gets the highscores of a game</p>",
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Scores"
  },
  {
    "type": "post",
    "url": "scores/:game/:name/:score",
    "title": "Post hihgscore",
    "name": "PostScore",
    "group": "Scores",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game",
            "description": "<p>Name of game</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Title of game</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "score",
            "description": "<p>Score</p>"
          }
        ]
      }
    },
    "description": "<p>Sends the score</p>",
    "version": "0.0.0",
    "filename": "./routes/index.js",
    "groupTitle": "Scores"
  }
] });
