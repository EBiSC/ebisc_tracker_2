package EBiSC::Question::IMSBiosample;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'IMS has biosample IDs for cell line';
our $description = <<EOF;

* Exported by IMS API
* Biosample ID or donor biosample ID is missing from IMS API

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
