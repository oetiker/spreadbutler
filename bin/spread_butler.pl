#!/usr/bin/env perl

use strict;
use warnings;
use FindBin;
use lib "$FindBin::Bin/../thirdparty/lib/perl5";
use lib "$FindBin::Bin/../lib";

use Mojolicious::Commands;
use SpreadButler;

$ENV{MOJO_APP} = SpreadButler->new();

my $cmds = Mojolicious::Commands->new;

$cmds->namespaces(['SpreadButler::Command']);

$cmds->start;
