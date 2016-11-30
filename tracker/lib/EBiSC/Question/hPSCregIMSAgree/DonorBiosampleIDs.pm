package EBiSC::Question::hPSCregIMSAgree::DonorBiosampleIDs;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Does donor Biosample ID always match between IMS and hPSCreg?';
our $description = <<EOF;

A cell line is tested if...

* If hPSCreg API exports a donor biosample ID for the line
* ...and if IMS API exports a donor biosample ID for the line
* ...and not marked as withdrawn in hPSCreg

Requirements to pass:

* Donor biosample ID in IMS matches donor biosample ID in hPSCreg

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->hpscreg_line->c->find(
    {'obj.biosamples_id' => {'$exists' => boolean::true}},
    {'obj.status.withdrawn' => {'$ne' => boolean::true}},
    {projection => {'name' => 1, 'obj.biosamples_donor_id' => 1}},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    my $ims_doc = $self->db->ims_line->c->find_one(
      {name => $next->{name}},
      {'obj.donor.biosamples_id' => 1},
    );
    next LINE if !$ims_doc;
    next LINE if ! exists $ims_doc->{obj}{donor}{biosamples_id};
    $num_tested += 1;
    next LINE if
      defined $ims_doc->{obj}{donor}{biosamples_id}
      && defined $next->{obj}{biosamples_donor_id}
      && $ims_doc->{obj}{donor}{biosamples_id} eq $next->{obj}{biosamples_donor_id};
    $self->add_failed_line(cell_line => $next->{name});
  }

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
