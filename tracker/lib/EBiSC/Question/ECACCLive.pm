package EBiSC::Question::ECACCLive;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Does ECACC website display cell line?';
our $description = <<EOF;

A cell line is tested if:

* It is marked "go live" in IMS
* ...and it has a CLIP in IMS
* ...and it has a ECACC catalogue number in IMS
* ...and either:
  * It has a CofA in IMS
  * ...or it is marked expand-to-order in IMS

Requirements to pass:

* ECACC website returns a page that looks like it is displaying the cell line

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find(
    {
      'obj.flag_go_live' => boolean::true,
      'obj.cell_line_information_packs.0' => {'$exists' => boolean::true},
      'obj.ecacc_cat_no' => {'$exists' => boolean::true},
      '$or' => [
        {'obj.batches.certificate_of_analysis.file' => {'$exists' => boolean::true}},
        {'obj.availability' => 'Expand to order'},
      ]
    },
    {projection => {name => 1}},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    $num_tested += 1;
    next LINE if $self->db->ecacc_line->c->count({name => $next->{name}, exported => boolean::true}, {limit => 1});
    $self->add_failed_line(cell_line => $next->{name});
  }
  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
