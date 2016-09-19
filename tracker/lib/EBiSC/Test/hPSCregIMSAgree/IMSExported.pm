package EBiSC::Test::hPSCregIMSAgree::IMSExported;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Line is not exported by IMS';
our $description = <<EOF;

* Exported by hPSCreg API
* Marked as submitted in hPSCreg API
* Not exported by IMS API

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->hpscreg_line->c->find(
    {'obj.status.submitted' => boolean::true},
    {'name' => 1},
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

with 'EBiSC::Test::Role::Test';

1;
