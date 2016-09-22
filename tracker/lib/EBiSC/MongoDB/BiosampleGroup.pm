package EBiSC::MongoDB::BiosampleGroup;
use Moose;
use namespace::autoclean;
use EBiSC::MongoDB;
use strict;
use warnings;

has 'name' => (is => 'ro', isa => 'Str', default => 'biosample_group');
with 'EBiSC::MongoDB::Role::Collection';

sub ensure_indexes {
  my ($self) = @_;
  $self->c->indexes->create_one(
    ['biosample_id' => 1],
    {unique => 1},
  );
}

__PACKAGE__->meta->make_immutable;
1;

