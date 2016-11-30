package EBiSC::Question::hPSCregIMSAgree::IMSExported;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Does IMS export all cell lines exported by hPSCreg?';
our $description = <<EOF;

A cell line is tested if...

* If line is exported by hPSCreg API
* ...and if marked as submitted in hPSCreg API
* ...and not marked as withdrawn in hPSCreg API

Requirements to pass:

* Cell line is exported by IMS API

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->hpscreg_line->c->find(
    {'obj.status.submitted' => boolean::true},
    {'obj.status.withdrawn' => {'$ne' => boolean::true}},
    {projection => {name => 1}},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    $num_tested += 1;
    next LINE if $self->db->ims_line->c->count({name => $next->{name}}, {limit => 1});
    $self->add_failed_line(cell_line => $next->{name});
  }

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
