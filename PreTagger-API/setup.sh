#!/bin/bash

virtualenv venv --python=python3

venv/bin/pip3 install flask
venv/bin/pip3 install boto3