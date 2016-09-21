package EBiSC::Question::Role::Question;
use Moose::Role;
use namespace::autoclean;
use strict;
use warnings;

requires qw(run);
has 'db' => (is => 'rw', isa => 'EBiSC::MongoDB', builder => '_build_db', lazy => 1);
has 'num_tested' => (is => 'rw', isa => 'Int');
has 'failed_items' => (is => 'rw', isa => 'ArrayRef[HashRef]', default => sub {return []});

sub num_failed {
  my ($self) = @_;
  return scalar @{$self->failed_items};
}

sub add_failed_batch {
  my ($self, %options) = @_;
  die "did not get batch" if !$options{batch};
  die "did not get cell_line" if !$options{cell_line};
  push(@{$self->failed_items}, {
    batch => $options{batch},
    cellLine => $options{cell_line},
  });
}

sub add_failed_line {
  my ($self, %options) = @_;
  die "did not get cell_line" if !$options{cell_line};
  push(@{$self->failed_items}, {
    cellLine => $options{cell_line},
  });
}

has 'title' => (is => 'ro', default => sub {
  my ($self) = @_;
  return eval '$'.$self->meta->name.'::title';
});
has 'description' => (is => 'ro', default => sub {
  my ($self) = @_;
  return eval '$'.$self->meta->name.'::description';
});

sub _build_db {
  return EBiSC::MongoDB->new->db;
}

1;
