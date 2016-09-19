package EBiSC::MongoDB::Role::Collection;
use Moose::Role;
use strict;
use warnings;

requires 'name';
requires 'ensure_indexes';
has 'db' => (is => 'rw', isa => 'MongoDB::Database', builder => '_build_db', lazy => 1);
has 'c' => (is => 'rw', isa => 'MongoDB::Collection', builder => '_build_collection', lazy => 1);

sub _build_db {
  return EBiSC::MongoDB->new->db;
}

sub _build_collection {
  my ($self) = @_;
  return $self->db->get_collection($self->name);
}


sub reset {
  my ($self) = @_;
  $self->c->drop;
  $self->ensure_indexes;
}

1;
