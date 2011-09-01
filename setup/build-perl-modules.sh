#!/bin/bash

. `dirname $0`/sdbs.inc

for module in \
    Mojolicious \
    Spreadsheet::Read \
    Spreadsheet::XLSX \
; do
    perlmodule $module
done

        
