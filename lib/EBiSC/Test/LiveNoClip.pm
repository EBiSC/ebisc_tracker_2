package EBiSC::Test::LiveNoClip;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Marked as go live but no CLIP';
our $description = <<EOF;

* Marked as go live in IMS API
* Does not have a CLIP

EOF


sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find(
    {
      'obj.flag_go_live' => boolean::true,
      'obj.cell_line_information_packs.0' => {'$exists' => boolean::false},
    },
    {'name' => 1},
  );
  foreach my $fail ($cursor->all) {
    $self->add_failed_line(cell_line => $fail->{name});
  }
  my $num_tested = $self->db->ims_line->c->count({'obj.flag_go_live' => boolean::true});
  $self->num_tested($num_tested);

}

with 'EBiSC::Test::Role::Test';

1;
