package EBiSC::Question::IMSBiosample;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Does the IMS have biosample IDs for all cell lines?';
our $description = <<EOF;

A cell line is tested if it is exported by the IMS API

Requirements to pass:

* Biosample ID is present for the cell line
* Donor biosample ID is present for the cell line

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find(
    {'$or' => [
      {'obj.biosamples_id' => {'$exists' => boolean::false}},
      {'obj.donor.biosamples_id' => {'$exists' => boolean::false}},
    ]},
    {projection => {name => 1}},
  );
  foreach my $fail ($cursor->all) {
    $self->add_failed_line(cell_line => $fail->{name});
  }
  my $num_tested = $self->db->ims_line->c->count({});

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
