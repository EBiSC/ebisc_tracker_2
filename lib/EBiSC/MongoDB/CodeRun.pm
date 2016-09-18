package EBiSC::MongoDB::CodeRun;
use Moose;
use namespace::autoclean;
use strict;
use warnings;

has 'name' => (is => 'ro', isa => 'Str', default => 'code_run');
with 'EBiSC::MongoDB::Role::Collection';

sub ensure_indexes {
  my ($self) = @_;
  $self->c->indexes->create_one(['date' => -1]);
}

__PACKAGE__->meta->make_immutable;

1;

