#!/usr/bin/env perl

use strict;
use warnings;
use FindBin;
use lib "$FindBin::Bin/../thirdparty/lib/perl5";
use lib "$FindBin::Bin/../lib";

use Mojolicious::Commands;
use SpreadButler;

die "Please set SPREAD_BUTLER_DATA to the directory where your spreadsheets are stored\n"
    unless $ENV{SPREAD_BUTLER_DATA} and -d $ENV{SPREAD_BUTLER_DATA};

$ENV{MOJO_APP} = SpreadButler->new();

my $cmds = Mojolicious::Commands->new;


$cmds->namespaces(['SpreadButler::Command']);

$cmds->start;
