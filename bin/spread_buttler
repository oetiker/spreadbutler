#!/usr/bin/env perl

use strict;
use warnings;
use FindBin;
use lib "$FindBin::Bin/../thirdparty/lib/perl5";
use lib "$FindBin::Bin/../lib";

use Mojolicious::Commands;
use SpreadButtler;

$ENV{MOJO_APP} = SpreadButtler->new();

my $cmds = Mojolicious::Commands->new;

$cmds->namespaces(['SpreadButtler::Command']);

$cmds->start;
