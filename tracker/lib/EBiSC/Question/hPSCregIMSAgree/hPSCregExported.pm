package EBiSC::Question::hPSCregIMSAgree::hPSCregExported;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Line is not exported by hPSCreg';
our $description = <<EOF;

* Exported by IMS API
* Not exported by hPSCreg API

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find({},
    {'name' => 1},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    $num_tested += 1;
    next LINE if $self->db->hpscreg_line->c->count({name => $next->{name}}, {limit => 1});
    $self->add_failed_line(cell_line => $next->{name});
  }

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
