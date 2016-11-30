package EBiSC::Question::Biosamples::LineExported;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Does Biosamples export all cell line IDs found in hPSCreg?';
our $description = <<EOF;

A cell line is tested if...

* If cell line is exported by hPSCreg API
* ...and not marked as withdrawn in hPSCreg API
* ...and if hPSCreg lists a cell line biosample ID for that cell line

Requirements to pass:

Biosamples exports that cell line biosample in its API

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->hpscreg_line->c->find(
    {'obj.biosamples_id' => {'$exists' => boolean::true}},
    {'obj.status.withdrawn' => {'$ne' => boolean::true}},
    {projection => {'name' => 1, 'obj.biosamples_id' => 1}},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    $num_tested += 1;
    my $biosamples_doc = $self->db->biosample->c->find_one(
      {biosample_id => $next->{obj}{biosamples_id}},
      {'biosample_id' => 1},
    );
    next LINE if $biosamples_doc;
    $self->add_failed_line(cell_line => $next->{name});
  }

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
