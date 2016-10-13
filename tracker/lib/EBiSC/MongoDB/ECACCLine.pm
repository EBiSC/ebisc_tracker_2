package EBiSC::MongoDB::ECACCLine;
use Moose;
use namespace::autoclean;
use strict;
use warnings;

has 'name' => (is => 'ro', isa => 'Str', default => 'ecacc_line');
with 'EBiSC::MongoDB::Role::Collection';

sub ensure_indexes {
  my ($self) = @_;
  $self->c->indexes->create_one(
    ['name' => 1],
    {unique => 1},
  );
}

__PACKAGE__->meta->make_immutable;

1;

