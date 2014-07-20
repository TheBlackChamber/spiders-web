#!/bin/sh
mvn clean compile flyway:validate
rm -rf ./target

