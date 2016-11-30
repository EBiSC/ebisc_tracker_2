package EBiSC::Question::hPSCregIMSAgree::hPSCregExported;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Does hPSCreg export all cell lines exported by IMS?';
our $description = <<EOF;

A cell line is tested if it is exported by IMS API

Requirements to pass:

* Cell line is exported by hPSCreg API
* ...and cell line is not marked as withdrawn in hPSCreg API

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find({},
    {projection => {'name' => 1}},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    $num_tested += 1;
    next LINE if $self->db->hpscreg_line->c->count({name => $next->{name}, 'obj.status.withdrawn' => {'$ne' => boolean::true}}, {limit => 1});
    $self->add_failed_line(cell_line => $next->{name});
  }

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
