package EBiSC::MongoDB::Biosample;
use Moose;
use namespace::autoclean;
use EBiSC::MongoDB;
use strict;
use warnings;

has 'name' => (is => 'ro', isa => 'Str', default => 'biosample');
with 'EBiSC::MongoDB::Role::Collection';

1;


