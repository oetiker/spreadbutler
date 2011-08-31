#!/bin/bash

. `dirname $0`/sdbs.inc

for module in \
    Mojolicious \
    Spreadsheet::Read \
; do
    perlmodule $module
done

        
