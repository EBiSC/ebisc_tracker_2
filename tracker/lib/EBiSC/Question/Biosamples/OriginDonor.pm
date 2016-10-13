package EBiSC::Question::Biosamples::OriginDonor;
use Moose;
use namespace::autoclean;
use boolean qw(true false);
use strict;
use warnings;

our $title = 'Is batch "Origin donor" in Biosamples always consistent with the IMS donor?';
our $description = <<EOF;

A batch is tested if...

* If batch is listed for a cell line in the IMS API
* ...and if batch is exported by Biosamples API
* ...and if IMS has a donor biosample id

Requirements to pass:

Passes if "origin donor" tag in Biosamples matches donor biosamples ID in IMS

EOF

sub run {
  my ($self) = @_;

  my $cursor = $self->db->ims_line->c->find(
    {'obj.donor.biosamples_id' => {'$exists' => boolean::true}},
    {projection => {'name' => 1, 'obj.batches.biosamples_id' => 1, 'obj.donor.biosamples_id' => 1}},
  );
  my $num_tested = 0;
  LINE:
  while (my $next = $cursor->next) {
    ID:
    foreach my $id ( map {$_->{biosamples_id}} @{$next->{obj}{batches}}) {
      my $biosamples_doc = $self->db->biosample_group->c->find_one(
        {biosample_id => $id},
        {'obj.characteristics.OriginDonor.text' => 1},
      );
      next ID if !$biosamples_doc;
      $num_tested += 1;
      my ($pass, $fail) = (0,0);
      foreach my $char (@{$biosamples_doc->{obj}{characteristics}{OriginDonor}}) {
        if ($char->{text} && $char->{text} eq $next->{obj}{donor}{biosamples_id}) {
          $pass = 1;
        }
        else {
          $fail = 1;
        }
      }
      next ID if $pass && !$fail;
      $self->add_failed_batch(cell_line => $next->{name}, batch => $id);
    }
  }

  $self->num_tested($num_tested);

}

with 'EBiSC::Question::Role::Question';

1;
