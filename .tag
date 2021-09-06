#!/usr/bin/env sh

VERSION=v$(echo 'console.log(require("./package.json").version)' | node -)
git tag $VERSION
git push origin $VERSION
