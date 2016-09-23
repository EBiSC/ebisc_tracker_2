package EBiSC::Question::Biosamples::VialDerivedFrom;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Vial in batch has "derived from" tag that that matches the batch "origin cell line" tag';
our $description = <<EOF;

* Tested if batch is listed for a cell line in the IMS API
* Tested if batch is exported by Biosamples API
* Tested if batch has a "origin cell line" tag

Requirements to pass:
* First vial in the batch is exported by biosamples
* That vial has a "derived from" characteristic
* Vial is derived from a biosample_id that matches the "origin cell line" tag

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->biosample_group->c->find(
    {'obj.characteristics.origin_cell_line' => {'$exists' => boolean::true}},
    {projection => {'biosample_id' => 1, 'vial_derived_from' => 1, 'obj.characteristics.origin_cell_line.text' => 1}},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    $num_tested += 1;
    my $origin_cell_line = $next->{obj}{characteristics}{origin_cell_line}[0]{text};
    next LINE if $next->{vial_derived_from} && $next->{vial_derived_from} eq $origin_cell_line;
    my $ims_cursor = $self->db->ims_line->c->find(
      {'obj.batches.biosamples_id' => $next->{biosample_id}},
      {projection => {name => 1}},
    );
    while (my $ims_line = $ims_cursor->next) {
      $self->add_failed_batch(cell_line => $ims_line->{name}, batch => $next->{biosample_id});
    }
  }

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
