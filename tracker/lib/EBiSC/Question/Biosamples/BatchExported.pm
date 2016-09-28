package EBiSC::Question::Biosamples::BatchExported;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Does Biosamples export all batch IDs found in IMS?';
our $description = <<EOF;

A batch is tested if it is listed for a cell line in the IMS API

Requirements to pass:

Biosamples exports that batch biosample in its API

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find(
    {},
    {projection => {'name' => 1, 'obj.batches.biosamples_id' => 1}},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    foreach my $id ( map {$_->{biosamples_id}} @{$next->{obj}{batches}}) {
      $num_tested += 1;
      my $biosamples_doc = $self->db->biosample_group->c->find_one(
        {biosample_id => $id},
        {'biosample_id' => 1},
      );
      next LINE if $biosamples_doc;
      $self->add_failed_batch(cell_line => $next->{name}, batch => $id);
    }
  }

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
