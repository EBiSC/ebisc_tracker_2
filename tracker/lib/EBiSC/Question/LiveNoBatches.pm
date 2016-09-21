package EBiSC::Question::LiveNoBatches;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Marked as go live but IMS has no batches';
our $description = <<EOF;

* Marked as go live in IMS API
* Does not have any batches listed in IMS API

EOF


sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find(
    {
      'obj.flag_go_live' => boolean::true,
      'obj.batches.0' => {'$exists' => boolean::false},
    },
    {'name' => 1},
  );
  foreach my $fail ($cursor->all) {
    $self->add_failed_line(cell_line => $fail->{name});
  }
  my $num_tested = $self->db->ims_line->c->count({'obj.flag_go_live' => boolean::true});
  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
