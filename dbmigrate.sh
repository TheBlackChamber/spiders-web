#!/bin/sh
mvn clean compile flyway:migrate
rm -rf ./target

