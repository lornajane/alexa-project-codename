#!/bin/bash

zip -r project-codename.zip index.js node_modules

wsk action update --kind nodejs:6 -P params.js  alexa/project-codename project-codename.zip

