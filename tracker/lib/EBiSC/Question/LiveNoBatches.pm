package EBiSC::Question::LiveNoBatches;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Do all "go live" cell lines have a batch in IMS?';
our $description = <<EOF;

A cell line is tested if...

* If line is exported by the IMS API
* ...and if that line is marked as "go live"
* ...and if that line is not marked as availability="Expand to order"

Requirements to pass:

* The cell line has at least one batch listed in the IMS

EOF


sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find(
    {
      'obj.flag_go_live' => boolean::true,
      'obj.batches.0' => {'$exists' => boolean::false},
      'obj.availability' => {'$ne' => 'Expand to order'},
    },
    {projection => {name => 1}},
  );
  foreach my $fail ($cursor->all) {
    $self->add_failed_line(cell_line => $fail->{name});
  }
  my $num_tested = $self->db->ims_line->c->count({'obj.flag_go_live' => boolean::true});
  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
