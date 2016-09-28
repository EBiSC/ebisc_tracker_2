package EBiSC::Question::LiveNoCofA;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Do all "go live" cell lines have a CofA in IMS?';
our $description = <<EOF;

A cell line is tested if...

* If line is exported by the IMS API
* ...and if that line is marked as "go live"

Requirements to pass:

* The cell line has a certificate of analysis file listed in the IMS

EOF


sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find(
    {
      'obj.flag_go_live' => boolean::true,
      'obj.batches.certificate_of_analysis.file' => {'$exists' => boolean::false},
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
