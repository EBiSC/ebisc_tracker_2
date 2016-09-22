package EBiSC::Question::hPSCregIMSAgree::BiosampleIDs;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Cell line Biosample ID does not match between IMS and hPSCreg';
our $description = <<EOF;

* hPSCreg API exports a biosample ID for the line
* IMS API exports a biosample ID for the line
* Cell line biosample IDs do not match between IMS and hPSCreg

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->hpscreg_line->c->find(
    {'obj.biosamples_id' => {'$exists' => boolean::true}},
    {projection => {'name' => 1, 'obj.biosamples_id' => 1}},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    my $ims_doc = $self->db->ims_line->c->find_one(
      {name => $next->{name}},
      {'obj.biosamples_id' => 1},
    );
    next LINE if !$ims_doc;
    next LINE if ! exists $ims_doc->{obj}{biosamples_id};
    $num_tested += 1;
    next LINE if
      defined $ims_doc->{obj}{biosamples_id}
      && defined $next->{obj}{biosamples_id}
      && $ims_doc->{obj}{biosamples_id} eq $next->{obj}{biosamples_id};
    $self->add_failed_line(cell_line => $next->{name});
  }

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
