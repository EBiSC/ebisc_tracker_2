package EBiSC::Question::hPSCregBiosample;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Does hPSCreg have biosample IDs for all cell lines?';
our $description = <<EOF;

A cell line is tested if...

* Exported by hPSCreg API
* Marked as submitted or has a validator comment in hPSCreg API
* Not marked as withdrawn in hPSCreg API

Requirements to pass:

* Biosample ID is present for the cell line in hPSCreg
* Donor biosample ID is present for the cell line in hPSCreg

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->hpscreg_line->c->find(
    {
      '$and' => [
        {'$or' => [
          {'obj.status.submitted' => boolean::true},
          {'obj.status.validator_comment' => {'$exists' => boolean::true}},
        ]},
        {'obj.status.withdrawn' => {'$ne' => boolean::true}},
        {'$or' => [
          {'obj.biosamples_id' => {'$exists' => boolean::false}},
          {'obj.biosamples_donor_id' => {'$exists' => boolean::false}},
        ]},
      ],
    },
    {projection => {name => 1}},
  );
  foreach my $fail ($cursor->all) {
    $self->add_failed_line(cell_line => $fail->{name});
  }
  my $num_tested = $self->db->hpscreg_line->c->count(
    {
      '$or' => [
        {'obj.status.submitted' => boolean::true},
        {'obj.status.validator_comment' => {'$exists' => boolean::true}},
        ],
      'obj.status.withdrawn' => {'$ne' => boolean::true},
    }
  );

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
