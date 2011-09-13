#!/usr/bin/env perl

BEGIN {
    if ($ENV{'PAR_TEMP'}) {
        use FindBin;
        my $dir = File::Spec->catfile ($ENV{'PAR_TEMP'}, 'inc');
        chdir $dir or die "chdir: '$dir': $!";
    }
    else {
        use FindBin;
        use lib "$FindBin::Bin/../thirdparty/lib/perl5";
        use lib "$FindBin::Bin/../lib";
    }
}

use strict;
use warnings;

use Mojolicious::Commands;
use SpreadButler;

die "Please set SPREAD_BUTLER_DATA to the directory where your spreadsheets are stored\n"
    unless $ENV{SPREAD_BUTLER_DATA} and -d $ENV{SPREAD_BUTLER_DATA};

$ENV{MOJO_APP} = SpreadButler->new();

my $cmds = Mojolicious::Commands->new;


$cmds->namespaces(['SpreadButler::Command']);

$cmds->start;
