package EBiSC::Question::IMSDonorBiosample;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Does the IMS have donor biosample IDs for all cell lines?';
our $description = <<EOF;

A cell line is tested if

* Cell line is exported by the IMS API
* Its validation_status in IMS is not "Name registered, no data"

Requirements to pass:

* Donor biosample ID is present for the cell line

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find(
    {
      'obj.donor.biosamples_id' => {'$exists' => boolean::false},
      'obj.validation_status' => {'$ne' => 'Name registered, no data'}
    },
    {projection => {name => 1}},
  );
  foreach my $fail ($cursor->all) {
    $self->add_failed_line(cell_line => $fail->{name});
  }
  my $num_tested = $self->db->ims_line->c->count({
    'obj.validation_status' => {'$ne' => 'Name registered, no data'}
  });

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
