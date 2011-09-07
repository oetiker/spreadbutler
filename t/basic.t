#!/usr/bin/env perl
use Mojo::Base -strict;

use Test::More tests => 4;
use Test::Mojo;

use_ok 'SpreadButler';

my $t = Test::Mojo->new('SpreadButler');
$t->get_ok('/')->status_is(200)->content_like(qr/Mojolicious/i);
