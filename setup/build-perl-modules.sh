#!/bin/bash

. `dirname $0`/sdbs.inc

for module in \
    Mojolicious \
    Mojo::Server::FastCGI \
    Spreadsheet::Read \
    Spreadsheet::XLSX \
; do
    perlmodule $module
done

        
